import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { ToastService } from '../../services/toast/toast.service';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../types/User';
import { catchError, of } from 'rxjs';

export const userResolver: ResolveFn<User|null> = (route, state) => {
  
  const userService = inject(UserService);
  const router = inject(Router);
  const toastService = inject(ToastService);
  const authService = inject(AuthService);

  const id = authService.decodedToken?.userId ?? '';
  
  return userService.getUserById(id).pipe(
    catchError(error=>{
      console.log(error);
      toastService.error('No se puideron cargar los datos del usuario');
      router.navigateByUrl('/');
      return of(null);
    })
  )

};
