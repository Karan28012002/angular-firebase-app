import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss']
})
export class ProfileSettingsComponent {

  user = {
    name: '',
    email: 'user@example.com',
    password: ''
  };

  constructor() { }

  onSubmit() {
    console.log('Profile updated:', this.user);
  }

}
