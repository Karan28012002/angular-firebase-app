import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private secret = 'My Own JWT Secret';

  private base64url(str: string): string {
    return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
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

    const encodedHeader = this.base64url(JSON.stringify(header));
    const encodedPayload = this.base64url(JSON.stringify(payload));
    const signature = await this.sign(`${encodedHeader}.${encodedPayload}`);

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  async verifyToken(token: string): Promise<boolean> {
    const parts = token.split('.');
    if (parts.length !== 3) return false;

    const [header, payload, signature] = parts;
    const expectedSig = await this.sign(`${header}.${payload}`);
    return expectedSig === signature;
  }

  decodePayload<T = any>(token: string): T | null {
    try {
      const parts = token.split('.');
      return JSON.parse(atob(parts[1]));
    } catch {
      return null;
    }
  }
}
