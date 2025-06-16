import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ProductService } from '../../core/services/product.service';
import { loadProducts, loadProductsSuccess, loadProductsFailure } from './product.actions';

@Injectable()
export class ProductEffects {
  loadProducts$;

  constructor(private actions$: Actions, private productService: ProductService) {
    console.log('ProductEffects constructor called.');
    console.log('Actions instance (in constructor):', this.actions$);

    this.loadProducts$ = createEffect(() =>
      this.actions$.pipe(
        ofType(loadProducts),
        mergeMap(() =>
          this.productService.getProducts().pipe(
            map(products => loadProductsSuccess({ products })),
            catchError(error => of(loadProductsFailure({ error: error.message })))
          )
        )
      )
    );
  }
} 