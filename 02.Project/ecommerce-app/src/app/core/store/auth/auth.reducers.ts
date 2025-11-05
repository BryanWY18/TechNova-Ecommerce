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
  on(AuthActions.login, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(
    AuthActions.loginSuccess,
    (state, { token, refreshToken, decodedToken }) => ({
      ...state,
      token,
      refreshToken,
      decodedToken,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    })
  ),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    error,
    isLoading: false,
    isAuthenticated: false,
  })),

  on(AuthActions.register, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(AuthActions.registerSuccess, (state) => ({
    ...state,
    isLoading: false,
    error: null,
  })),
  on(AuthActions.registerFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),
  on(
    AuthActions.refreshTokenSuccess,
    (state, { token, refreshToken, decodedToken }) => ({
      ...state,
      token,
      refreshToken,
      decodedToken,
      isAuthenticated: true,
      error: null,
    })
  ),
  on(AuthActions.refreshTokenFailure, (state, {error})=>({
    ...state,
    error,
    isAuthenticated:false,
    refreshToken: null,
    token: null,
    decodedToken: null
  }))
);
