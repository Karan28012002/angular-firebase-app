import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, throwError, of } from 'rxjs';
import { catchError, filter, map, switchMap, tap, finalize } from 'rxjs/operators';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { EmailService } from './email.service';

interface UserImage {
  url: string;
  name: string;
}

interface UserDataResponse {
  images: UserImage[];
  limitStatus: { exceeded: boolean; error: string | null };
}

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  private userImagesSubject = new BehaviorSubject<UserImage[]>([]);
  userImages$: Observable<UserImage[]> = this.userImagesSubject.asObservable();

  private uploadLimitExceededSubject = new BehaviorSubject<boolean>(false);
  uploadLimitExceeded$: Observable<boolean> = this.uploadLimitExceededSubject.asObservable();

  private uploadLimitErrorSubject = new BehaviorSubject<string | null>(null);
  uploadLimitError$: Observable<string | null> = this.uploadLimitErrorSubject.asObservable();

  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();

  private currentUser: SocialUser | null = null;

  constructor(
    private authService: SocialAuthService,
    private emailService: EmailService
  ) {
    this.authService.authState.pipe(
      tap(user => {
        this.currentUser = user;
        this.isLoadingSubject.next(true);
      }),
      switchMap(user => {
        if (user?.email) {
          // Fetch both images and upload limit when user is available
          return combineLatest([
            this.fetchUserImages(user.email),
            this.checkUploadLimit(user.email)
          ]).pipe(
            map(([images, limitStatus]) => ({ images, limitStatus })),
            catchError(error => {
              console.error('Error fetching user data after login:', error);
              // Optionally handle error by resetting data or showing a global message
              this.userImagesSubject.next([]);
              this.uploadLimitExceededSubject.next(true);
              this.uploadLimitErrorSubject.next('Failed to load user data.');
              return throwError(() => error); // Re-throw to propagate error if needed
            }),
            tap(() => this.isLoadingSubject.next(false))
          );
        } else {
          // Reset data if user logs out
          this.userImagesSubject.next([]);
          this.uploadLimitExceededSubject.next(false);
          this.uploadLimitErrorSubject.next(null);
          this.isLoadingSubject.next(false);
          return of({ images: [], limitStatus: { exceeded: false, error: null } });
        }
      })
    ).subscribe({
      next: (data: UserDataResponse) => {
        console.log('User data fetched:', data);
      },
      error: (err) => {
        console.error('User data service subscription error:', err);
      }
    });
  }

  private fetchUserImages(email: string): Observable<UserImage[]> {
    return this.emailService.getUserIMages(email).pipe(
      map((response: any) => {
        if (response && response.success === true) {
          if (typeof response.result === 'string') {
             const imageUrls = response.result.split(',').filter((url: string) => url.trim() !== '');
             const images = imageUrls.map((url: string) => ({
                url: url.trim(),
                name: this.getFileNameFromUrl(url.trim())
             }));
             this.userImagesSubject.next(images);
             return images;
          } else if (Array.isArray(response.result)) {
             const images = response.result.map((item: any) => ({
                url: item.image_url || item.url,
                name: item.name || this.getFileNameFromUrl(item.image_url || item.url)
             }));
             this.userImagesSubject.next(images);
             return images;
          } else {
            console.error('API response for fetching images was not in expected format:', response);
            this.userImagesSubject.next([]);
            return [];
          }
        } else {
          console.error('API response for fetching images was not successful:', response);
          this.userImagesSubject.next([]);
          return [];
        }
      }),
      catchError(apiError => {
        console.error('Error fetching user images from API:', apiError);
        this.userImagesSubject.next([]);
        return of([]); // Return empty array on error
      })
    );
  }

  private checkUploadLimit(email: string): Observable<{ exceeded: boolean, error: string | null }> {
     return this.emailService.getImageUploadLimit(email).pipe(
       map((limitResponse: any) => {
         if (limitResponse && limitResponse.success === true) {
           this.uploadLimitExceededSubject.next(false);
           this.uploadLimitErrorSubject.next(null);
           return { exceeded: false, error: null };
         } else if (limitResponse && limitResponse.success === false) {
           const errorMsg = limitResponse.result || limitResponse.message || 'Upload limit exceeded.';
           this.uploadLimitExceededSubject.next(true);
           this.uploadLimitErrorSubject.next(errorMsg);
           return { exceeded: true, error: errorMsg };
         } else {
           const errorMsg = limitResponse?.message || 'Could not verify upload limit due to unexpected API response structure.';
           this.uploadLimitExceededSubject.next(true);
           this.uploadLimitErrorSubject.next(errorMsg);
           return { exceeded: true, error: errorMsg };
         }
       }),
       catchError((limitError) => {
         console.error('Error checking upload limit:', limitError);
         const errorMsg = limitError.message || 'Failed to check upload limit.';
         this.uploadLimitExceededSubject.next(true);
         this.uploadLimitErrorSubject.next(errorMsg);
         return of({ exceeded: true, error: errorMsg }); // Return error status on error
       })
     );
  }

  private getFileNameFromUrl(url: string): string {
    try {
      const urlObject = new URL(url);
      const pathname = urlObject.pathname;
      const parts = pathname.split('/');
      return decodeURIComponent(parts[parts.length - 1]);
    } catch (e) {
      console.error('Error extracting filename from URL:', e);
      return 'Unnamed File';
    }
  }

  // Expose a method to trigger a refetch if needed (e.g., after a successful upload)
  refetchUserData(): void {
     if (this.currentUser?.email) {
        this.isLoadingSubject.next(true);
        combineLatest([
          this.fetchUserImages(this.currentUser.email),
          this.checkUploadLimit(this.currentUser.email)
        ]).pipe(finalize(() => this.isLoadingSubject.next(false))).subscribe();
     }
  }
} 