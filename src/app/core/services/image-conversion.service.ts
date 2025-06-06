import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

interface ConversionResponse {
  success: boolean;
  convertedImageUrl?: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ImageConversionService {

  private conversionApiUrl = environment.imageConversionApiUrl;

  constructor(private http: HttpClient) { }

  /**
   * Sends an image URL to a backend API for conversion.
   * @param imageUrl The URL of the image to convert.
   * @param targetFormat The desired format (e.g., 'jpg', 'png', 'webp').
   * @returns An Observable of the conversion response.
   */
  convertImage(imageUrl: string, targetFormat: string): Observable<ConversionResponse> {
    if (!this.conversionApiUrl) {
      console.error('Image conversion API URL is not configured in the environment.');
      return of({ success: false, message: 'Conversion API not configured' });
    }

    let headers = new HttpHeaders();
    if (environment.imageConversionApiKey) {
      headers = headers.set('X-API-Key', environment.imageConversionApiKey);
    }

    // Explicitly set responseType to 'json' to avoid ArrayBuffer interpretation
    return this.http.post<ConversionResponse>(this.conversionApiUrl, {
      imageUrl: imageUrl,
      targetFormat: targetFormat
    }, { headers: headers, responseType: 'json' }).pipe(
      map(response => {
        if (response.success && response.convertedImageUrl) {
          return { success: true, convertedImageUrl: response.convertedImageUrl };
        } else {
          console.error('Image conversion API returned an error or missing URL:', response);
          return { success: false, message: response.message || 'Unknown conversion error' };
        }
      }),
      catchError(error => {
        console.error('Error calling image conversion API:', error);
        return of({ success: false, message: error.message || 'HTTP error during conversion' });
      })
    );
  }
} 