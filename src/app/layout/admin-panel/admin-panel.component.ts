import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ImageUploadService } from '../../core/services/image-upload.service';
import { finalize } from 'rxjs/operators';
import { SupabaseService } from '../../core/services/supabase.service';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EmailService } from '../../core/services/email.service';
import { from, concatMap, of, map, catchError, Observable, Subscription } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';
import { UserDataService } from '../../core/services/user-data.service';
import { ImageConversionService } from '../../core/services/image-conversion.service';
import { MatSidenav } from '@angular/material/sidenav';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';

interface UploadResult {
  file: File;
  uploadResponse?: { imageUrl: string };
  apiResponse?: any;
  apiError?: any;
  uploadError?: string;
  apiWarning?: string;
}

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatGridListModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatMenuModule
  ],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  private sidebarSub: Subscription;
  private authStateSub: Subscription | undefined;

  uploadedImages: { url: string; name: string }[] = [];
  convertedImages: { url: string; name: string, originalName: string, format: string }[] = [];
  isDragging = false;
  isLoading = false;
  user: SocialUser | null = null;
  uploadLimitExceeded = false;
  uploadLimitError = '';

  selectedImage: string | null = null;

  // Observables from UserDataService
  userImages$: Observable<{ url: string; name: string }[]>;
  isLoading$: Observable<boolean>;
  uploadLimitExceeded$: Observable<boolean>;
  uploadLimitError$: Observable<string | null>;

  // Chart properties
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    }
  };
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [ ],
    datasets: [ { data: [] } ]
  };
  public pieChartType: ChartType = 'pie';

  constructor(
    private snackBar: MatSnackBar,
    private imageUploadService: ImageUploadService,
    private supabaseService: SupabaseService,
    private authService: SocialAuthService,
    private emailService: EmailService,
    private userDataService: UserDataService,
    private imageConversionService: ImageConversionService
  ) {
    this.userImages$ = this.userDataService.userImages$;
    this.isLoading$ = this.userDataService.isLoading$;
    this.uploadLimitExceeded$ = this.userDataService.uploadLimitExceeded$;
    this.uploadLimitError$ = this.userDataService.uploadLimitError$;

    this.authService.authState.subscribe(user => {
      this.user = user;
    });

    this.sidebarSub = new Subscription();

    this.userImages$.subscribe(images => {
      this.uploadedImages = images;
      this.updateChartData(images);
    });
  }

  ngOnInit(): void {
    // authState subscription is in constructor
  }

  private updateChartData(images: { url: string; name: string }[]): void {
    const fileTypeCounts: { [key: string]: number } = {};

    images.forEach(image => {
      const fileExtension = image.name.split('.').pop()?.toLowerCase() || 'other';
      fileTypeCounts[fileExtension] = (fileTypeCounts[fileExtension] || 0) + 1;
    });

    this.pieChartData = {
      labels: Object.keys(fileTypeCounts).map(key => key.toUpperCase()),
      datasets: [ { data: Object.values(fileTypeCounts) } ]
    };

    console.log('Updated chart data:', this.pieChartData);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(files);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(input.files);
    }
  }

  private handleFiles(files: FileList): void {
    const filesArray = Array.from(files);
    if (filesArray.length === 0) {
        return;
    }

    if (!this.user || !this.user.id || !this.user.email) {
        this.snackBar.open('Please log in to upload images.', 'Close', { duration: 3000 });
        return;
    }

    if (this.uploadLimitExceeded) {
         this.snackBar.open(`Upload limit exceeded: ${this.uploadLimitError}`, 'Close', { duration: 5000 });
         return;
    }

    this.processImageUploads(filesArray);
  }

  private processImageUploads(filesArray: File[]): void {
    this.isLoading = true;
    let processedCount = 0;
    const totalFiles = filesArray.length;

    from(filesArray).pipe(
      concatMap(file => {
        if (!file.type.startsWith('image/')) {
          this.snackBar.open(`'${file.name}' is not an image file and was skipped.`, 'Close', { duration: 3000 });
          processedCount++;
          return of(null);
        }

        return this.imageUploadService.uploadImage(file).pipe(
          concatMap((uploadResponse: { imageUrl: string }) => {
            if (!uploadResponse || !uploadResponse.imageUrl) {
              console.warn('Supabase upload response missing imageUrl for', file.name, ':', uploadResponse);
              this.snackBar.open(`Upload to storage failed for '${file.name}'`, 'Close', { duration: 3000 });
              processedCount++;
              return of<UploadResult>({ file, uploadError: 'No image URL received' });
            }

            this.snackBar.open(`'${file.name}' uploaded to storage successfully`, 'Close', { duration: 3000 });

            if (!this.user?.email) {
              console.warn('No user email available to send image link to API for', file.name);
              this.snackBar.open('Could not send image link (user email missing).', 'Close', { duration: 3000 });
              processedCount++;
              return of<UploadResult>({ file, uploadResponse, apiWarning: 'Email missing' });
            }

            return this.emailService.uploadImageLink(this.user.email, uploadResponse.imageUrl).pipe(
              map(apiResponse => {
                processedCount++;
                if (apiResponse && apiResponse.success) {
                  this.snackBar.open(
                    `'${file.name}' processed (${processedCount}/${totalFiles})`, 
                    'Close', 
                    { duration: 2000 }
                  );
                  return { file, uploadResponse, apiResponse } as UploadResult;
                } else {
                  console.error('Backend API response not successful for', file.name, ':', apiResponse);
                  this.snackBar.open(
                    `Failed to register '${file.name}' with backend (${processedCount}/${totalFiles})`, 
                    'Close', 
                    { duration: 3000 }
                  );
                  return { file, uploadResponse, apiError: apiResponse?.message || 'Unknown error' } as UploadResult;
                }
              }),
              catchError(apiError => {
                processedCount++;
                console.error('Image link API call failed for', file.name, ':', apiError);
                this.snackBar.open(
                  `Failed to register '${file.name}' with backend: ${apiError.message || 'Unknown error'} (${processedCount}/${totalFiles})`, 
                  'Close', 
                  { duration: 3000 }
                );
                return of<UploadResult>({ file, uploadResponse, apiError });
              })
            );
          }),
          catchError(uploadError => {
            processedCount++;
            console.error('Supabase Storage upload error for', file.name, ':', uploadError);
            this.snackBar.open(
              `Failed to upload '${file.name}' to storage: ${uploadError.message || 'Unknown error'} (${processedCount}/${totalFiles})`, 
              'Close', 
              { duration: 3000 }
            );
            return of<UploadResult>({ file, uploadError: uploadError.message || 'Unknown error' });
          })
        );
      }),
      finalize(() => {
        this.isLoading = false;
        if (processedCount === totalFiles) {
          this.userDataService.refetchUserData();
          this.snackBar.open(`Completed processing ${processedCount} images`, 'Close', { duration: 3000 });
        }
      })
    ).subscribe({
      next: (result: UploadResult | null) => {
        if (result) {
          console.log('File processing result:', result);
          if (result.apiError) {
            console.error('Backend API error:', result.apiError);
          } else if (result.uploadError) {
            console.error('Storage upload error:', result.uploadError);
          }
        }
      },
      error: (err) => {
        console.error('An error occurred during file processing stream:', err);
        this.snackBar.open('An error occurred during file processing.', 'Close', { duration: 5000 });
      },
      complete: () => {
        console.log('All files processed stream completed.');
      }
    });
  }

  removeImage(index: number): void {
    const removedImage = this.uploadedImages.splice(index, 1)[0];
    console.log(`Removed image: ${removedImage.name} from display`);
    this.snackBar.open('Image removed from gallery (local display)', 'Close', {
      duration: 3000
    });
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

  viewImage(imageUrl: string): void {
    this.selectedImage = imageUrl;
  }

  closeImage(): void {
    this.selectedImage = null;
  }

  downloadImage(imageUrl: string, fileName: string = 'download'): void {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  printImage(imageUrl: string): void {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write('<html><body><img src="' + imageUrl + '"></body></html>');
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
      };
    } else {
       console.error('Failed to open print window.');
    }
  }

  shareImage(imageUrl: string, fileName: string): void {
    if (navigator.share) {
      fetch(imageUrl)
        .then(response => response.blob())
        .then(blob => {
          const file = new File([blob], fileName, { type: blob.type });
          navigator.share({
            files: [file],
            title: fileName,
            text: `Check out this image: ${imageUrl}`,
          }).catch(error => console.error('Error sharing', error));
        })
        .catch(error => {
          console.error('Error fetching image for sharing', error);
          navigator.share({
            title: fileName,
            text: `Check out this image: ${imageUrl}`,
            url: imageUrl,
          }).catch(error => console.error('Error sharing URL', error));
        });
    } else {
      console.log(`Sharing not supported. Image URL: ${imageUrl}`);
      this.snackBar.open('Sharing not supported on this browser. You can copy the image URL.', 'Close', { duration: 5000 });
    }
  }

  convertImage(imageUrl: string, fileName: string, targetFormat: string): void {
     console.log(`Attempted to convert '${fileName}' to ${targetFormat.toUpperCase()}`);
     this.snackBar.open(`Image conversion feature is coming soon!`, 'Close', { duration: 3000 });
  }

  removeConvertedImage(index: number): void {
    this.convertedImages.splice(index, 1);
    this.snackBar.open('Converted image removed from list (local display)', 'Close', {
      duration: 3000
    });
  }

  ngOnDestroy() {
    if (this.authStateSub) {
      this.authStateSub.unsubscribe();
    }
    if (this.sidebarSub) {
      this.sidebarSub.unsubscribe();
    }
  }
}
