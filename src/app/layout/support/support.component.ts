import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatMenuModule, MatButtonModule],
  templateUrl: './support.component.html',
  styleUrl: './support.component.scss',
})
export class SupportComponent {}
