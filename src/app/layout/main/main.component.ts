import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { SupportComponent } from '../support/support.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subscription } from 'rxjs';
import { SidebartoggleService } from '../../core/services/sidebartoggle.service';
@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    FooterComponent,
    SidebarComponent,
    HeaderComponent,
    SupportComponent,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterOutlet,
    FormsModule,
    MatFormFieldModule, // <-- Add this
    MatInputModule, // <-- Add this
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  opened = false;
  private sidebarSub: Subscription;

  constructor(private sidebarService: SidebartoggleService) {
    this.sidebarSub = this.sidebarService.sidebarOpen$.subscribe(() => {
      this.toggleSidebar();
    });
  }

  toggleSidebar() {
    this.opened = !this.opened;
  }

  ngOnDestroy() {
    this.sidebarSub.unsubscribe();
  }
}
