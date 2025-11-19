import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

type RegisterPayload = { displayName: string; email: string; password: string };
type RegisterResponse = { displayName: string; email: string };
type LoginPayload = { email: string; password: string };
type LoginResponse = { token: string };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private base = environment.apiBase; // p.ej. http://localhost:3000/api

  register(body: RegisterPayload) {
    return this.http.post<RegisterResponse>(`${this.base}/auth/register`, body).pipe(
      catchError((err) => {
        const msg = err?.error?.message || 'No se pudo registrar';
        return throwError(() => new Error(msg));
      })
    );
  }

  login(email: string, password: string) {
    const body: LoginPayload = { email, password };
    return this.http.post<LoginResponse>(`${this.base}/auth/login`, body).pipe(
      map((res) => {
        localStorage.setItem('token', res.token);
        return res;
      }),
      catchError((err) => {
        const msg = err?.error?.message || 'Credenciales inválidas';
        return throwError(() => new Error(msg));
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const isExpired = payload.exp * 1000 < Date.now();

      if (isExpired) {
        localStorage.removeItem('token');
        return false;
      }

      return true;
    } catch (error) {
      // Si no se puede parsear el token, lo removemos
      localStorage.removeItem('token');
      return false;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
