import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Product } from '../../models/product.model';
import { loadProducts } from '../../store/product/product.actions';
import { selectAllProducts, selectProductsLoading, selectProductsError } from '../../store/product/product.selectors';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressSpinnerModule, MatButtonModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Products from API (NGRX)</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div *ngIf="(loading$ | async); else productsContent" class="loading-spinner">
          <mat-spinner [diameter]="30"></mat-spinner>
          <span>Loading Products...</span>
        </div>

        <ng-template #productsContent>
          <div *ngIf="(error$ | async) as error" class="error-message">
            <p>Error: {{ error }}</p>
            <button mat-raised-button color="warn" (click)="retryLoad()">Retry</button>
          </div>
          <div *ngIf="!(loading$ | async) && !(error$ | async) && (products$ | async)?.length === 0" class="no-products">
            <p>No products found.</p>
            <button mat-raised-button color="primary" (click)="retryLoad()">Load Products</button>
          </div>

          <div *ngIf="products$ | async as products" class="product-grid">
            <mat-card *ngFor="let product of products" class="product-card">
              <img mat-card-image [src]="product.image" [alt]="product.title">
              <mat-card-content>
                <h3>{{ product.title }}</h3>
                <p class="price">$ {{ product.price | number:'1.2-2' }}</p>
                <p class="category">{{ product.category }}</p>
              </mat-card-content>
            </mat-card>
          </div>
        </ng-template>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    mat-card {
      margin: 20px;
      padding: 20px;
    }
    .loading-spinner, .error-message, .no-products {
      text-align: center;
      padding: 20px;
    }
    .error-message p {
      color: red;
    }
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    .product-card {
      display: flex;
      flex-direction: column;
      height: 100%;
      img {
        max-height: 150px;
        object-fit: contain;
        padding: 10px;
      }
      mat-card-content {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        h3 {
          font-size: 1.1em;
          margin-top: 0;
          margin-bottom: 10px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .price {
          font-weight: bold;
          color: #3f51b5;
          margin-bottom: 5px;
        }
        .category {
          font-size: 0.8em;
          color: #777;
        }
      }
    }
  `]
})
export class ProductListComponent implements OnInit {
  products$: Observable<Product[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(private store: Store) {
    this.products$ = this.store.select(selectAllProducts);
    this.loading$ = this.store.select(selectProductsLoading);
    this.error$ = this.store.select(selectProductsError);
  }

  ngOnInit(): void {
    this.store.dispatch(loadProducts());
  }

  retryLoad(): void {
    this.store.dispatch(loadProducts());
  }
} 