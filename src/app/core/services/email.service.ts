import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'process';
import { firstValueFrom, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  constructor(private http: HttpClient) {}

  async sendOtp(email: string): Promise<any> {
    const params = new HttpParams().set('email', email);
    return await firstValueFrom(
      this.http.post<any>(`${environment.apiBaseUrl}Email/send-otp`, null, {
        params,
      })
    );
  }

  async verifyOtp(email: string, otp: string): Promise<any> {
    const params = new HttpParams().set('email', email).set('otp', otp);
    return await firstValueFrom(
      this.http.post<any>(`${environment.apiBaseUrl}Email/verify-otp`, null, {
        params,
      })
    );
  }

  logEmail(email: string, displayName: string): Observable<any> {
    const body = {
      email: email,
      displayName: displayName,
    };
  
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-api-key': 'Abhay@123',
    });
  
    return this.http.post<any>(`${environment.liveEmailUrl}`, body, { headers });
  }

  uploadImageLink(email: string, imageLink: string): Observable<any> {
    const body = {
      email: email,
      imageLink: imageLink,
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-api-key': 'Abhay@123',
    });

    return this.http.post<any>(`${environment.imageUploadUrl}`, body, { headers });
  }

  getImageUploadLimit(email: string): Observable<any> {
    const params = new HttpParams().set('email', email);

    const headers = new HttpHeaders({
      'x-api-key': 'Abhay@123',
    });

    return this.http.get<any>(`${environment.imageLimitUpload}`, { headers, params });
  }

  getUserIMages(email: string): Observable<any> {
    const params = new HttpParams().set('email', email);
    const headers = new HttpHeaders({
      'x-api-key': 'Abhay@123',
    });

    return this.http.get<any>(`${environment.getUserImages}`, { headers, params });
  }

  // Method to call backend API for image conversion
  convertImage(imageUrl: string, targetFormat: string): Observable<any> {
    const body = {
      imageUrl: imageUrl,
      targetFormat: targetFormat
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-api-key': 'Abhay@123', // Use your API key
    });

    // Assuming you have environment.convertImageUrl defined with the backend endpoint
    if (!environment.convertImageUrl) {
      return new Observable(observer => {
        observer.error(new Error('Conversion API URL not defined in environment.'));
      });
    }

    return this.http.post<any>(`${environment.convertImageUrl}`, body, { headers });
  }
}
