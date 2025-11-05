import { createReducer, on, State } from "@ngrx/store";
import { initialAuthState } from "./auth.state";
import * as AuthActions from './auth.actions'
import { tr } from "zod/v4/locales";

export const authReducer = createReducer(
    initialAuthState,
    on(AuthActions.initializeAuth, (state)=>(
        {...state, isLoading:true})),
    on(AuthActions.logout, (state)=>(
        {...state,
        isAuthenticaded:false, 
        token:null, 
        decodedToken:null, 
        refreshToken:null
        })),
    on(AuthActions.login, (state) =>(
        {...state, isLoading: true, error:null})),
);

