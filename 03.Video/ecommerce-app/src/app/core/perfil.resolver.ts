import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { ProfileService } from './profile.service';
import { of, catchError } from 'rxjs';

export const perfilResolver: ResolveFn<any> = (route, state) => {
  const perfilService = inject(ProfileService);
  const router = inject(Router);

  return perfilService.getProfile().pipe(
    catchError(err => {
      if (err.status === 401) {
        router.navigate(['/auth/login']);
      } else {
        router.navigate(['/']);
      }
      return of(null);
    })
  )
};
