import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    MatCardModule,
    MatListModule,
    MatIconModule
  ]
})
export class AdminPanelComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  // Properties to control grid layout dynamically
  gridCols: number = 4; // Default columns
  userListColspan: number = 2; // Default colspan for user list
  systemStatusColspan: number = 2; // Default colspan for system status
  recentActivityColspan: number = 4; // Default colspan for recent activity


  // Static data for dashboard sections
  userStats = {
    totalUsers: 1500,
    activeSessions: 120,
    recentRegistrations: 45
  };

  recentActivities = [
    { user: 'Alice Smith', action: 'Logged in', time: new Date() },
    { user: 'Bob Johnson', action: 'Updated profile', time: new Date(Date.now() - 60000 * 5) },
    { user: 'Charlie Brown', action: 'Registered', time: new Date(Date.now() - 60000 * 15) },
    { user: 'Alice Smith', action: 'Logged out', time: new Date(Date.now() - 60000 * 30) },
  ];

  userList = [
    { name: 'Karan Kapoor', email: 'tryt14865@gmail.com', avatar: 'https://via.placeholder.com/40/673ab7/ffffff?text=KK' },
    { name: 'Alice Smith', email: 'alice.s@example.com', avatar: 'https://via.placeholder.com/40/512da8/ffffff?text=AS' },
    { name: 'Bob Johnson', email: 'bob.j@example.com', avatar: 'https://via.placeholder.com/40/3f51b5/ffffff?text=BJ' },
    // Add more dummy users here
  ];

  systemStatus = {
    dbStatus: 'Online',
    apiStatus: 'Online',
    lastUpdated: new Date()
  };

  constructor(private breakpointObserver: BreakpointObserver) { }

  ngOnInit(): void {
    // Observe changes in breakpoints and update grid properties
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge
    ])
    .pipe(takeUntil(this.destroy$))
    .subscribe((state: BreakpointState) => {
      if (state.breakpoints[Breakpoints.XSmall]) {
        this.gridCols = 1;
        this.userListColspan = 1;
        this.systemStatusColspan = 1;
        this.recentActivityColspan = 1;
      } else if (state.breakpoints[Breakpoints.Small]) {
        this.gridCols = 2;
        this.userListColspan = 2; // User list takes full row on small
        this.systemStatusColspan = 2; // System status takes full row on small
        this.recentActivityColspan = 2; // Recent activity takes full row on small
      } else if (state.breakpoints[Breakpoints.Medium]) {
        this.gridCols = 3;
        this.userListColspan = 2; // User list takes 2/3 on medium
        this.systemStatusColspan = 1; // System status takes 1/3 on medium
        this.recentActivityColspan = 3; // Recent activity takes full row on medium
      } else if (state.breakpoints[Breakpoints.Large] || state.breakpoints[Breakpoints.XLarge]) {
        this.gridCols = 4;
        this.userListColspan = 2; // User list takes 2/4 (1/2) on large/xlarge
        this.systemStatusColspan = 2; // System status takes 2/4 (1/2) on large/xlarge
        this.recentActivityColspan = 4; // Recent activity takes full row on large/xlarge
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}