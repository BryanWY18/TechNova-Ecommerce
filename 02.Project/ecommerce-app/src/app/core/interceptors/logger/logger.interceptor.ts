import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastService } from '../../services/toast/toast.service';
import { catchError, throwError } from 'rxjs';

export const loggerInterceptor: HttpInterceptorFn = (req, next) => {

  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error:HttpErrorResponse)=>{
      const errorMessage=getErrorMessage(error);
      toastService.error(errorMessage,3000);
      return throwError(()=>error);
    })
  );
};

const getErrorMessage = (error:HttpErrorResponse):string =>{
  if(error.status===0){
    return 'No hay conexión a internet';
  }
  if(error.error?.message){
    return error.error.message;
  }
  switch(error.status){
    case 400:
      return 'Datos inválidos, verfica la información';
    case 401:
      return 'Sesión expirada. Por favor inicie sesión nueva';
    case 403:
      return 'No tienes permiso para realizar esta acción';
    case 404:
      return 'Recurso no encontrado';
    case 409:
      return 'El recurso ya existe o hay un conflicto';
    case 422:
      return 'Error de validación';
    case 500:
      return 'Error del servidor';
    case 503:
      return 'Servidor no disponible. Intenta más tarde';
    default:
      return `Error inesperado (${error.status}). Intente nuevamente`;
  }
  return ''
}
