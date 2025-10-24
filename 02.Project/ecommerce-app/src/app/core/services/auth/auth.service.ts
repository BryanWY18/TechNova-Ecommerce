import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, map, Observable, throwError } from 'rxjs';
import { tokenSchema } from '../../types/Token';
import { Router } from '@angular/router';

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

  private authSubject: BehaviorSubject<boolean>=new BehaviorSubject<boolean>(false);
  auth$:Observable<boolean>;
  
  constructor(private httpClient: HttpClient, private router: Router) {    
    this.authSubject.next(!!this.token);
    this.auth$= this.authSubject.asObservable();
  }
 

  isAuth(){
    return this.authSubject.value;
  }

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

/*
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
  */

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
        this.authSubject.next(true);
        
        this.router.navigateByUrl('/')
      },
      error:(error)=>{
        console.log(error);
      }
    })
  }

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.authSubject.next(false);
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
