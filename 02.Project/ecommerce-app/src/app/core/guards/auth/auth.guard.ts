import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);

  /*
  authService.auth$.pipe(
    take(1),
  ).subscribe({
    next:(data)=>{
      if(data){
        return true;
      }
      else{
        return false
      }
    },error:()=>{
      return false;
    }});
    */
    
    const router=inject(Router)
    if(authService.isAuth()){
      return true;
    }
    router.navigateByUrl('/login');
    return false;

};
