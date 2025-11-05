import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast/toast.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { decodedToken } from '../../types/Token';

@Injectable()
export class AuthEffects {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly actions$ = inject(Actions);
  private readonly baseUrl = 'http://localhost:3000/api/auth';

  intializeAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.initializeAuth),
      map(() => {
        const token = localStorage.getItem('token');
        if (!token) {
          return AuthActions.initializeAuthFailure();
        }
        const decodedToken = jwtDecode<decodedToken>(token);
        return AuthActions.initializeAuthSuccess({ decodedToken });
      })
    )
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ credentials }) =>
        this.http
          .post<{ token: string; refreshToken: string }>(
            `${this.baseUrl}/login`,
            credentials
          )
          .pipe(
            map((response) => {
              localStorage.setItem('token', response.token);
              localStorage.setItem('refreshToken', response.refreshToken);
              const decodedToken = jwtDecode<decodedToken>(response.token);
              return AuthActions.loginSuccess({
                token: response.token,
                refreshToken: response.refreshToken,
                decodedToken,
              });
            }),
            catchError((error) => {
              return of(AuthActions.loginFailure({
                error: error.error?.message || 'Error al iniciar sesión',
              }));
            })
          )
      )
    )
  );
}
