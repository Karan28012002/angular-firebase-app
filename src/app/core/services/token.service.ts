import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private secret = '🔥MySuperSecretKeyOnlyForDemo🔥'; // Keep in frontend ONLY for testing!

  private base64url(str: string): string {
    return btoa(unescape(encodeURIComponent(str)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  private async sign(data: string): Promise<string> {
    const enc = new TextEncoder().encode(data + this.secret);
    const digest = await crypto.subtle.digest('SHA-256', enc);
    return this.base64url(String.fromCharCode(...new Uint8Array(digest)));
  }

  async generateToken(payload: any): Promise<string> {
    const header = {
      alg: 'MY-ALG-256',
      typ: 'MYTOKEN',
    };

    const defaultPayload = {
      ...payload,
      exp: Date.now() + 5 * 60 * 1000, // expires in 5 minutes
      aud: 'my-angular-app.local', // restrict to your app
    };

    const encodedHeader = this.base64url(JSON.stringify(header));
    const encodedPayload = this.base64url(JSON.stringify(defaultPayload));
    const signature = await this.sign(`${encodedHeader}.${encodedPayload}`);

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  async verifyToken(token: string): Promise<boolean> {
    const parts = token.split('.');
    if (parts.length !== 3) return false;

    const [header, payload, signature] = parts;
    const expectedSig = await this.sign(`${header}.${payload}`);
    if (expectedSig !== signature) return false;

    // Check expiry and audience
    const decodedPayload = this.decodePayload(token);
    if (!decodedPayload) return false;

    const now = Date.now();
    return (
      decodedPayload.exp > now && decodedPayload.aud === 'my-angular-app.local'
    );
  }

  decodePayload<T = any>(token: string): T | null {
    try {
      const parts = token.split('.');
      const decoded = decodeURIComponent(escape(atob(parts[1])));
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  }
}
