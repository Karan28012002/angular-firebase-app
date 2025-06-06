import { Component, OnInit, OnDestroy, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { SupportComponent } from '../support/support.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subscription } from 'rxjs';
import { SidebartoggleService } from '../../core/services/sidebartoggle.service';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Router } from '@angular/router';

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
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  opened = false;
  private sidebarSub: Subscription;
  private authStateSub: Subscription | undefined;
  loggedIn = false;
  user: SocialUser | null = null;

  constructor(private sidebarService: SidebartoggleService, private authService: SocialAuthService, private router: Router) {
    this.sidebarSub = this.sidebarService.sidebarOpen$.subscribe(() => {
      this.toggleSidebar();
    });
  }

  ngOnInit() {
    console.log('MainComponent ngOnInit');
    this.authStateSub = this.authService.authState.subscribe((user) => {
      console.log('authState subscription triggered');
      console.log('User object:', user);
      this.user = user;
      const wasLoggedIn = this.loggedIn;
      this.loggedIn = !!user;
      console.log(`loggedIn: ${this.loggedIn}, wasLoggedIn: ${wasLoggedIn}`);

      if (this.loggedIn && !wasLoggedIn) {
        console.log('Login detected, attempting to open sidebar with setTimeout and navigate to Admin');
        this.router.navigate(['/Admin']);

        setTimeout(() => {
          console.log('setTimeout callback executed');
          console.log('Sidenav reference:', this.sidenav);
          if (this.sidenav && !this.sidenav.opened) {
            console.log('Sidenav exists and is not open, calling open()');
            this.sidenav.open();
            this.opened = true;
          } else if (!this.sidenav) {
            console.warn('Sidenav reference is NOT available in setTimeout');
          } else if (this.sidenav.opened) {
            console.log('Sidenav is already open');
            this.opened = true;
          }
        }, 0);
      } else if (!this.loggedIn && this.sidenav && this.sidenav.opened) {
        console.log('Logout detected, closing sidebar');
        this.sidenav.close();
        this.opened = false;
      }
    });
  }

  // Host listener for the beforeunload event
  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent) {
    if (this.loggedIn) {
      // Setting returnValue to any non-empty string triggers the browser's default warning.
      // The custom message will likely not be displayed by modern browsers.
      event.returnValue = 'You may be logged out if you leave or refresh this page.';
    }
  }

  toggleSidebar() {
    console.log('toggleSidebar called');
    if (this.sidenav) {
      this.sidenav.toggle();
      this.opened = this.sidenav.opened;
      console.log('Sidenav toggled');
    } else {
      console.warn('toggleSidebar called but sidenav reference is NOT available');
    }
  }

  ngOnDestroy() {
    console.log('MainComponent ngOnDestroy');
    this.sidebarSub.unsubscribe();
    this.authStateSub?.unsubscribe();
  }
}
