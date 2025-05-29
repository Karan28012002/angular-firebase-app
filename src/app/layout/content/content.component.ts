import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { SidebartoggleService } from '../../core/services/sidebartoggle.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss',
})
export class ContentComponent {
  constructor(private sidebarService: SidebartoggleService) {}

  onSocialSignup() {
    this.sidebarService.toggleSidebar();
  }
}
