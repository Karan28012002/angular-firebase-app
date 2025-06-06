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
import { Router, RouterModule } from '@angular/router';
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
    private googleService: GoogleAuthService,
    private router:Router
  ) {}

  ngOnInit() {
    // Subscribe to auth state changes
    this.socialAuthService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = user != null;
      console.log('User details:', user);
    });
  }

  signOut() {
    this.socialAuthService.signOut();

    this.user = null;
    this.loggedIn = false;
    this.router.navigate(['/'])
  }
}
