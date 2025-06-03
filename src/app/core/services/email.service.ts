import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'process';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private http: HttpClient) {}

  async sendOtp(email: string): Promise<any> {
    const params = new HttpParams().set('email', email);
    return await firstValueFrom(
      this.http.post<any>(`${environment.apiBaseUrl}/Email/send-otp`, null, { params })
    );
  }

  async verifyOtp(email: string, otp: string): Promise<any> {
    const params = new HttpParams().set('email', email).set('otp', otp);
    return await firstValueFrom(
      this.http.post<any>(`${environment.apiBaseUrl}/Email/verify-otp`, null, { params })
    );
  }
}
