import { createAction, props } from "@ngrx/store";
import { UserCredentials, userForm } from "../../types/User";
import { decodedToken } from "../../types/Token";

export const login = createAction(
    '[Auth] login',
    props<{credentials: UserCredentials}>
);

export const loginSuccess = createAction(
    '[Auth] login Success',
    props<{token:string, refreshToken:string, decodedToken:decodedToken}>
);

export const loginFailure = createAction(
    '[Auth] login Failure',
    props<{error:string}>
);

export const logout = createAction(
    '[Auth] Logout'
);

export const register = createAction(
    '[Auth] Register',
    props<{userData:userForm}>
);

export const registerSuccess = createAction(
    '[Auth] Register Success'
);

export const regiterFailure = createAction(
    '[Auth] regiter Failure',
    props<{error:string}>
);

export const refreshToken = createAction(
    '[Auth] refesh Token',
    props<{refreshToken:string}>
);

export const refreshTokenSuccess = createAction(
    '[Auth] refresh Token Success',
    props<{token:string, refreshToken:string, decodedToken:decodedToken}>
);

export const refreshTokenFailure = createAction(
    '[Auth] refresh Token Failure',
    props<{error:string}>
);

export const initializeAuth = createAction(
    '[Auth] initialize'
);

export const initializeAuthSuccess = createAction(
  '[Auth] Initialize Success',
  props<{ decodedToken: decodedToken }>()
);

export const initializeAuthFailure = createAction(
  '[Auth] Initialize Failure'
);

export const checkEmailExists = createAction(
  '[Auth] Check Email Exists',
  props<{ email: string }>()
);

export const checkEmailExistsSuccess = createAction(
  '[Auth] Check Email Exists Success',
  props<{ exists: boolean }>()
);

export const checkEmailExistsFailure = createAction(
  '[Auth] Check Email Exists Failure',
  props<{ error: string }>()
);