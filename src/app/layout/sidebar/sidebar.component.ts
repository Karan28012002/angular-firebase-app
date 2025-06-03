import {
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialAuthService,
  SocialLoginModule,
  SocialUser,
} from '@abacritt/angularx-social-login';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { GoogleAuthService } from '../../core/services/google-auth.service';
import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';

declare const FB: any;

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    GoogleSigninButtonModule,
    CommonModule,
    MatIconModule,
    RouterModule,
    SocialLoginModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  providers: [GoogleAuthService],
})
export class SidebarComponent implements OnInit {
  user: SocialUser | null = null;
  loggedIn: boolean = false;

  constructor(
    private socialAuthService: SocialAuthService,
    private googleService: GoogleAuthService
  ) {}

  ngOnInit() {
    // Subscribe to auth state changes
    this.socialAuthService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = user != null;
      console.log('User details:', user);
    });
  }

  // ✅ Triggered when Google login succeeds
  async handleGoogleLoginSuccess() {
    try {
      const user = await this.socialAuthService.signIn(
        GoogleLoginProvider.PROVIDER_ID
      );
      if (user) {
        // Send the ID token to your backend
        // const response = await this.googleService.loginWithGoogle(user.idToken);
        // console.log('Backend response:', response);
        // // Store user details in localStorage or a service
        localStorage.setItem('user', JSON.stringify(user));
      }
    } catch (error) {
      console.error('Google Sign-In error:', error);
    }
  }

  // ✅ Triggered if login fails
  handleGoogleLoginError() {
    console.error('Google Sign-In error:');
  }

  signOut(): void {
    this.socialAuthService.signOut();
    localStorage.removeItem('user');
    this.user = null;
    this.loggedIn = false;
  }
}
