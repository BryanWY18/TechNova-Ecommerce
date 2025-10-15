import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { map, Observable, throwError } from 'rxjs';
import { tokenSchema } from '../../types/Token';

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

  get refreshStorageToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  get decodedToken(): decodedToken | null {
    const token = this.token;
    return token ? jwtDecode<decodedToken>(token) : null;
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

  login(data:any){
    this.httpClient.post(`${this.baseUrl}/auth/login`,data).pipe(
      map(data=>{
        const response = tokenSchema.safeParse(data);
        if (!response.success) {
          console.log(response.error)
          throw new Error(`${response.error}`)
        }
        return response.data;
      })
    ).subscribe({
      next:(res)=>{
        localStorage.setItem('token', res.token);
        localStorage.setItem('refreshToken', res.refreshToken.toString());
      },
      error:(error)=>{
        console.log(error);
      }
    })
  }

  refreshToken(refreshToken:string){
    return this.httpClient.post(`${this.baseUrl}/auth/refresh-token`, {token:refreshToken});
  }

  checkEmailExist(email:string): Observable<boolean>{
    return this.httpClient.get<{exists:boolean}>(`${this.baseUrl}/auth/check-email`, {params:{email}}).pipe(
      map((res)=> res.exists)
    );
  }
}
