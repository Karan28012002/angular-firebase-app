import { createReducer, on } from '@ngrx/store';
import { initialState } from './counter.state';
import { increment, decrement, reset, customIncrement } from './counter.actions';

export const counterReducer = createReducer(
  initialState,
  on(increment, (state) => ({
    ...state,
    count: state.count + 1
  })),
  on(decrement, (state) => ({
    ...state,
    count: state.count - 1
  })),
  on(reset, (state) => ({
    ...state,
    count: 0
  })),
  on(customIncrement, (state, { value }) => ({
    ...state,
    count: state.count + value
  }))
); 