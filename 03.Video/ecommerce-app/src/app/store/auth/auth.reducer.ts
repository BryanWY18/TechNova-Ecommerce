import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { AuthState, initialAuthState } from './auth.models';

export const authReducer = createReducer<AuthState>(initialAuthState,
  on(AuthActions.loadUserSuccess, (state, { user }) => ({
    ...state,
    user,
  })),
  on(AuthActions.logout, (state) => ({
    ...state,
    user: null,
  }))
)
