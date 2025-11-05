import { decodedToken } from "../../types/Token";

export interface AuthState{
    token: string | null;
    refreshToken: string | null;
    decodedToken: decodedToken | null;
    isAuthenticaded: boolean;
    isLoading: boolean;
    error: string | null;
}

export const initialAuthState: AuthState = {
    token: localStorage.getItem('token'),
    refreshToken: localStorage.getItem('refreshToken'),
    decodedToken: null,
    isAuthenticaded: false,
    isLoading: false,
    error: null,
}
