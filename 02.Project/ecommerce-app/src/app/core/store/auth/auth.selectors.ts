import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AuthState } from "./auth.state";

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectToken = createSelector(
    selectAuthState,
    (state)=>state.token
);

export const selectRefreshToken = createSelector(
    selectAuthState,
    (state)=> state.refreshToken
);

export const selectDecodedToken = createSelector(
    selectAuthState,
    (state)=> state.decodedToken
);

export const selectIsAunthenticated = createSelector(
    selectAuthState,
    (state)=> state.isAuthenticated
);

export const selectIsLoading = createSelector(
    selectAuthState,
    (state)=> state.isLoading
);

export const selectAuthError = createSelector(
    selectAuthState,
    (state)=> state.error
);

export const selectUserId = createSelector(
    selectDecodedToken,
    (decodedToken) => decodedToken?.userId ?? null
);

export const selectUserRol = createSelector(
    selectDecodedToken,
    (decodedToken) => decodedToken?.role ?? null
);

export const selectIsAdmin = createSelector(
    selectUserRol,
    (role)=>role==='admin'
);