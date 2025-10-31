import { createReducer, on } from '@ngrx/store';
import { initialAuthState } from './auth.state';
import * as AuthActions from './auth.actions';

export const authReducer = createReducer(
  initialAuthState,

  on(AuthActions.initializeAuth, (state) => ({ ...state, isLoading: true })),

  on(AuthActions.Logout, (state) => ({
    ...state,
    isAuthenticated: false,
    token: null,
    decodedToken: null,
    refreshToken: null,
  })),
  on(AuthActions.login, (state)=>({...state, isLoading: true, error: null})),
);
