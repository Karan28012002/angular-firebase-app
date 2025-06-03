import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  constructor(private http: HttpClient) {}

  async loginWithGoogle(idToken: string): Promise<any> {
    return await firstValueFrom(
      this.http.post<any>(
        environment.apiBaseUrl + 'Auth/LoginWithGoogle',
        idToken,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
    );
  }
}
