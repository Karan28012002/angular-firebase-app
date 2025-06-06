import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatMenuModule, MatButtonModule, FormsModule],
  templateUrl: './support.component.html',
  styleUrl: './support.component.scss',
})
export class SupportComponent {

  // Define an object for the support request form
  supportRequest = {
    subject: '',
    message: ''
  };

  constructor(private router: Router) { }

  // Placeholder for the submit logic
  onSubmit() {
    console.log('Support request submitted:', this.supportRequest);
    // Here you would typically call a service to submit the support request
  }

  // Method to handle navigation
  navigateTo(route: string) {
    this.router.navigate([route]);
  }

}
