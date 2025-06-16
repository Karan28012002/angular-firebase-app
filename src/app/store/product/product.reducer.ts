import { createReducer, on } from '@ngrx/store';
import { initialState } from './product.state';
import { loadProducts, loadProductsSuccess, loadProductsFailure } from './product.actions';

export const productReducer = createReducer(
  initialState,
  on(loadProducts, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(loadProductsSuccess, (state, { products }) => ({
    ...state,
    products: products,
    loading: false,
    error: null
  })),
  on(loadProductsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error: error,
    products: []
  }))
); 