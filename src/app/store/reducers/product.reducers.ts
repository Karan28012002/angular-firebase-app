import {
  createReducer,
  on,
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';
import * as ProductActions from '../actions/product.actions';
import { Product } from '../models/product.models';

// 1. Define the ProductState interface
export interface ProductState {
  products: Product[];
  loading: boolean;
  error: any;
}

// 2. Initial state
export const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

// 3. Reducer
export const productReducer = createReducer(
  initialState,
  on(ProductActions.loadProducts, (state) => ({ ...state, loading: true })),
  on(ProductActions.loadProductsSuccess, (state, { products }) => ({
    ...state,
    products,
    loading: false,
    error: null,
  })),
  on(ProductActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  }))
);
