import { HttpHandler, HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { tick } from '@angular/core/testing';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService=inject(AuthService);
  const token=authService.token ?? '';
  const headers=new HttpHeaders({
    'Content-Type':'aplication/json',
    Authorization:`Bearer ${token}`
  });
  const newReq=req.clone({headers});
  return next(newReq);
};
