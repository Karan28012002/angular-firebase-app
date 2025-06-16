import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductState } from '../reducers/product.reducers';

// 4. Feature Selector
export const selectProductState =
  createFeatureSelector<ProductState>('productState');

// 5. Selectors
export const selectProducts = createSelector(
  selectProductState,
  (state) => state.products
);

export const selectLoading = createSelector(
  selectProductState,
  (state) => state.loading
);

export const selectError = createSelector(
  selectProductState,
  (state) => state.error
);
