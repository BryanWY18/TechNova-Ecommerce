import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { take } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectIsAunthenticated } from '../../store/auth/auth.selectors';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  /// 1,54,7562,42,454656,565
  // authService.auth$.pipe(
  //   take(1),
  // ).subscribe({ 
  //   next: (data) => {
  //     if (data) {
  //       return true;
  //     }
  //     else{
  //       return false;
  //     }
  // }, error: () => {
  //   return false;
  // } });
  const router = inject(Router)
  const store = inject(Store);

  let isAuth:boolean = false;

  store.select(selectIsAunthenticated).pipe(
    take(1)
  ).subscribe({next:(isAunthenticated)=>{isAuth=isAunthenticated}});

  if (isAuth) {
    return true
  }
  router.navigateByUrl('/login');
  return false;

};
