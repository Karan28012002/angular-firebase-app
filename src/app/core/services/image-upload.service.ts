import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class ImageUploadService {
  private supabase: SupabaseClient;
  private readonly bucketName = 'userimages';

  constructor(private supabaseService: SupabaseService) {
    this.supabase = this.supabaseService.getClient();
  }

  uploadImage(file: File): Observable<{ imageUrl: string }> {
    // Create a simple file path (e.g., using timestamp or random string)
    // Note: This path does not include a user ID as we are not checking for auth.
    const filePath = `${Date.now()}_${file.name}`;

    return from(this.supabase.storage.from(this.bucketName).upload(filePath, file)).pipe(
      switchMap(({ data, error }) => {
        if (error) {
          return throwError(() => new Error(`Storage upload failed: ${error.message}`));
        }

        const { data: urlData } = this.supabase.storage.from(this.bucketName).getPublicUrl(filePath);

        if (!urlData.publicUrl) {
          return throwError(() => new Error('Could not obtain public URL'));
        }

        // Return the public URL directly, skipping database insert
        return from([{ imageUrl: urlData.publicUrl }]);
      }),
      catchError(err => throwError(() => err))
    );
  }
}
