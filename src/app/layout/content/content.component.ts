import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { SidebartoggleService } from '../../core/services/sidebartoggle.service';
import { MatIconModule } from '@angular/material/icon';
import {
  GoogleLoginProvider,
  GoogleSigninButtonModule,
  SocialAuthService,
  SocialUser,
} from '@abacritt/angularx-social-login';
import { EmailService } from '../../core/services/email.service';
import { FormsModule } from '@angular/forms';
import {
  HttpClient,
  HttpHeaders,
  HttpClientModule,
} from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    GoogleSigninButtonModule,
    FormsModule,
    MatGridListModule,
    MatCardModule
  ],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss',
})
export class ContentComponent implements OnInit {
  showRegister = false;
  registerEmail = '';
  otpSent = false;
  otp = '';
  loading = false;
  message = '';
  error = '';
  loggedIn = false;
  user: SocialUser | null = null;
  userDetails: any = null;
  uploadedImages: { url: string; name: string }[] = [];
  isDragging = false;
  uploadProgress = 0;

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
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        this.simulateUpload(file);
      } else {
        this.snackBar.open('Please upload only image files', 'Close', {
          duration: 3000
        });
      }
    }
  }

  private simulateUpload(file: File): void {
    // Simulate upload progress
    this.uploadProgress = 0;
    const interval = setInterval(() => {
      this.uploadProgress += 10;
      if (this.uploadProgress >= 100) {
        clearInterval(interval);
        // Create a URL for the uploaded image
        const imageUrl = URL.createObjectURL(file);
        this.uploadedImages.push({
          url: imageUrl,
          name: file.name
        });
        this.snackBar.open('Image uploaded successfully', 'Close', {
          duration: 3000
        });
      }
    }, 200);
  }

  removeImage(index: number): void {
    this.uploadedImages.splice(index, 1);
    this.snackBar.open('Image removed', 'Close', {
      duration: 3000
    });
  }
  constructor(
    private sidebarService: SidebartoggleService,
    private emailService: EmailService,
    private socialAuthService: SocialAuthService,
    private http: HttpClient,private snackBar: MatSnackBar
  ) {}
  ngOnInit() {
    // Subscribe to auth state changes
    this.socialAuthService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = user != null;
      console.log('User object from authState:', user);
      if (user && user.idToken) {
        console.log('Access Token found in user object:', user.authToken);
        this.fetchGoogleUserDetails(user.authToken);
        this.emailService.logEmail(user.email, user.name).subscribe({
          next: (res) => console.log('Email logged successfully', res),
          error: (err) => console.error('Failed to log email:', err),
        });
      } else {
        this.userDetails = null;
      }
    });
  }

  onSocialSignup() {
    this.sidebarService.toggleSidebar();
  }

  handleGoogleLoginSuccess() {
    console.log(
      'Google login success event - authState subscription will handle details.'
    );
  }

  handleGoogleLoginError() {
    console.error(
      'Google login error event - handled by authState subscription error.'
    );
    alert('Google login failed. Please try again.');
  }

  openRegister() {
    this.showRegister = true;
    this.registerEmail = '';
    this.otpSent = false;
    this.otp = '';
    this.message = '';
    this.error = '';
  }

  closeRegister() {
    this.showRegister = false;
  }

  async sendOtp() {
    this.loading = true;
    this.error = '';
    this.message = '';
    try {
      await this.emailService.sendOtp(this.registerEmail);
      this.otpSent = true;
      this.message = 'OTP sent to your email!';
    } catch (err) {
      this.error = 'Failed to send OTP. Please try again.';
      console.error('Send OTP Error:', err);
    }
    this.loading = false;
  }

  async verifyOtp() {
    this.loading = true;
    this.error = '';
    this.message = '';
    try {
      await this.emailService.verifyOtp(this.registerEmail, this.otp);
      this.message = 'Email verified successfully!';
      this.showRegister = false;
      console.log(
        'Email verified! Implement next step for user registration/login.'
      );
    } catch (err) {
      this.error = 'Invalid OTP. Please try again.';
      console.error('Verify OTP Error:', err);
    }
    this.loading = false;
  }

  fetchGoogleUserDetails(accessToken: string) {
    const url = `https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses,birthdays,genders,photos&key=${environment.googleApiKey}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });
    this.http.get(url, { headers }).subscribe({
      next: (data) => {
        console.log('Successfully fetched user details:', data);
        this.userDetails = data;
      },
      error: (err) => {
        console.error('Error fetching user details:', err);
        this.userDetails = null;
        if (err.status === 401 || err.status === 403) {
          console.error(
            'Authentication/Permission issue with Google People API. Token or API Key might be invalid or lack scopes.'
          );
        }
      },
    });
  }

  signOut() {
    this.socialAuthService.signOut();
    this.user = null;
    this.loggedIn = false;
    this.userDetails = null;
  }
}
