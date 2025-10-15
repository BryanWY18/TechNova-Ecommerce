import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { map, Observable } from 'rxjs';

export type decodedToken = {
  userId: string;
  displayName: string;
  role: 'admin' | 'customer' | 'guest';
};
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = 'http://localhost:3000/api';
  
  constructor(private httpClient: HttpClient) {}
  get token(): string | null {
    return localStorage.getItem('token');
  }

get decodedToken(): decodedToken | null {
  const token = this.token;
  if (!token || !token.includes('.')) {
    console.warn('Token inválido o mal formado');
    return null;
  }
  try {
    return jwtDecode<decodedToken>(token);
  } catch (e) {
    console.error('Error al decodificar token:', e);
    return null;
  }
}

  register(data: any) {
    this.httpClient.post(`${this.baseUrl}/auth/register`, data).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

    login(data: any) {
    this.httpClient.post<any>(`${this.baseUrl}/auth/login`, data).subscribe({
      next: (res) => {
        localStorage.setItem('token',res.token);
        localStorage.setItem('refreshToken',res.refreshToken);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  checkEmailExist(email:string): Observable<boolean>{
    return this.httpClient.get<{exists:boolean}>(`${this.baseUrl}/auth/check-email`, {params:{email}}).pipe(
      map((res)=> res.exists)
    );
  }
}
