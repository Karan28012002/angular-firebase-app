import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { increment, decrement, reset, customIncrement } from '../../store/counter/counter.actions';
import { selectCount } from '../../store/counter/counter.selectors';
import { Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-counter',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatInputModule, FormsModule, MatCardModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>NGRX Counter Demo</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <h2>Current Count: {{ count$ | async }}</h2>
        <div>
          <button mat-raised-button color="primary" (click)="onIncrement()">Increment</button>
          <button mat-raised-button color="accent" (click)="onDecrement()">Decrement</button>
          <button mat-raised-button color="warn" (click)="onReset()">Reset</button>
        </div>
        <div class="custom-increment">
          <mat-form-field appearance="fill">
            <mat-label>Custom Value</mat-label>
            <input matInput type="number" [(ngModel)]="customValue">
          </mat-form-field>
          <button mat-raised-button (click)="onCustomIncrement()">Add Custom</button>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    mat-card {
      margin: 20px;
      padding: 20px;
      text-align: center;
    }
    div {
      margin-top: 10px;
    }
    button {
      margin: 5px;
    }
    .custom-increment {
      margin-top: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }
  `]
})
export class CounterComponent {
  count$: Observable<number>;
  customValue: number = 0;

  constructor(private store: Store) {
    this.count$ = this.store.select(selectCount);
  }

  onIncrement() {
    this.store.dispatch(increment());
  }

  onDecrement() {
    this.store.dispatch(decrement());
  }

  onReset() {
    this.store.dispatch(reset());
  }

  onCustomIncrement() {
    if (this.customValue !== null) {
      this.store.dispatch(customIncrement({ value: this.customValue }));
    }
  }
} 