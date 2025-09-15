import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from '../../environments/environment';
import { catchError, map, throwError } from "rxjs";

type RegisterPayload = {
  displayName: string;
  email: string;
  password: string;
};

type RegisterResponse = {
  displayName: string;
  email: string;
};

type LoginPayload = { email: string; password: string; };

type LoginResponse = { token: string };

@Injectable({ providedIn: 'root' })
export class AuthService {

  private http = inject(HttpClient);
  private base = environment.apiBase;


  login(email: string, password: string) {
    const body: LoginPayload = { email, password };
    return this.http.post<LoginResponse>(`${this.base}/auth/login`, body)
      .pipe(map(res => {
        localStorage.setItem('token', res.token);
        return res;
      }), catchError(err => {
        const msg = err?.error?.message || 'Credenciales no válidas';
        return throwError(() => new Error(msg));
      }));
  }

  register(body: RegisterPayload) {
    return this.http.post<RegisterResponse>(`${this.base}/auth/register`
      , body).pipe(
        catchError(err => {
          const msg = err?.error?.message || 'No se pudo registrar';
          return throwError(() => new Error(msg));
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

}
