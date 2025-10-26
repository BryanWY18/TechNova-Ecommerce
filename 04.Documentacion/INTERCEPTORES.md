# Guía de Interceptores HTTP en Angular 19

**Documentación oficial de Angular**: https://angular.dev/guide/http/interceptors

## ¿Qué son los Interceptores?

Los interceptores son funciones middleware que permiten interceptar y manipular peticiones HTTP antes de que sean enviadas al servidor, o respuestas antes de que lleguen a tu aplicación. Son útiles para implementar patrones comunes como autenticación, logging, manejo de errores y caché.

Piensa en los interceptores como filtros de seguridad en un aeropuerto: todas las peticiones deben pasar por ellos antes de salir, y todas las respuestas pasan por ellos antes de llegar a su destino.

## Tipos de Interceptores

Angular 19 soporta dos tipos de interceptores:

1. **Interceptores Funcionales** (Recomendado): Funciones simples y predecibles
2. **Interceptores Basados en DI**: Clases que implementan una interfaz

Esta guía se enfoca en interceptores funcionales por su comportamiento más predecible y mejor rendimiento.

## Crear un Interceptor

### Estructura Básica

Un interceptor es una función que recibe dos parámetros:

- `req`: La petición HTTP saliente
- `next`: Función que representa el siguiente paso en la cadena de interceptores

```typescript
import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

export function loggingInterceptor(
  req: HttpRequest<unknown>, 
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  console.log('Petición a:', req.url);
  return next(req);
}
```

### Configurar Interceptores

Los interceptores se configuran en `app.config.ts` usando `provideHttpClient`:

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { loggingInterceptor } from './interceptors/logging.interceptor';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([loggingInterceptor, authInterceptor])
    )
  ]
};
```

**Importante**: Los interceptores se ejecutan en el orden en que fueron declarados.

## Casos de Uso Comunes

### 1. Interceptor de Autenticación

Agrega automáticamente el token de autenticación a todas las peticiones.

```typescript
import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  // Obtener token del localStorage
  const token = localStorage.getItem('authToken');

  // Si no hay token, continuar sin modificar
  if (!token) {
    return next(req);
  }

  // Clonar la petición y agregar el header de autorización
  const clonedReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`)
  });

  return next(clonedReq);
}
```

**Uso más avanzado con servicio de autenticación**:

```typescript
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (!token) {
    return next(req);
  }

  const clonedReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(clonedReq);
}
```

### 2. Interceptor de Logging

Registra información sobre todas las peticiones y respuestas.

```typescript
import { HttpRequest, HttpHandlerFn, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export function loggingInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const startTime = Date.now();
  
  console.log(`Petición iniciada: ${req.method} ${req.url}`);

  return next(req).pipe(
    tap(event => {
      if (event.type === HttpEventType.Response) {
        const duration = Date.now() - startTime;
        console.log(`Petición completada: ${req.method} ${req.url}`);
        console.log(`Estado: ${event.status}`);
        console.log(`Duración: ${duration}ms`);
      }
    })
  );
}
```

**Logging con diferentes niveles**:

```typescript
export function detailedLoggingInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const startTime = Date.now();

  console.group(`HTTP ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.groupEnd();

  return next(req).pipe(
    tap({
      next: event => {
        if (event.type === HttpEventType.Response) {
          const duration = Date.now() - startTime;
          console.group(`Respuesta ${req.method} ${req.url}`);
          console.log('Status:', event.status);
          console.log('Duración:', `${duration}ms`);
          console.log('Body:', event.body);
          console.groupEnd();
        }
      },
      error: error => {
        const duration = Date.now() - startTime;
        console.group(`Error ${req.method} ${req.url}`);
        console.error('Error:', error);
        console.log('Duración:', `${duration}ms`);
        console.groupEnd();
      }
    })
  );
}
```

### 3. Interceptor de Manejo de Errores

Maneja errores HTTP de forma centralizada.

```typescript
import { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

export function errorInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ocurrió un error desconocido';

      if (error.error instanceof ErrorEvent) {
        // Error del cliente
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Error del servidor
        switch (error.status) {
          case 400:
            errorMessage = 'Solicitud incorrecta';
            break;
          case 401:
            errorMessage = 'No autorizado. Por favor inicie sesión';
            router.navigate(['/login']);
            break;
          case 403:
            errorMessage = 'Acceso prohibido';
            break;
          case 404:
            errorMessage = 'Recurso no encontrado';
            break;
          case 500:
            errorMessage = 'Error interno del servidor';
            break;
          default:
            errorMessage = `Error del servidor: ${error.status}`;
        }
      }

      console.error('Error HTTP:', errorMessage);
      return throwError(() => new Error(errorMessage));
    })
  );
}
```

### 4. Interceptor de Caché

Implementa caché simple para peticiones GET.

```typescript
import { HttpRequest, HttpHandlerFn, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

const cache = new Map<string, HttpResponse<any>>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export function cacheInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  // Solo cachear peticiones GET
  if (req.method !== 'GET') {
    return next(req);
  }

  // Verificar si la respuesta está en caché
  const cachedResponse = cache.get(req.url);
  if (cachedResponse) {
    console.log('Respuesta desde caché:', req.url);
    return of(cachedResponse.clone());
  }

  // Si no está en caché, hacer la petición y guardar la respuesta
  return next(req).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        cache.set(req.url, event.clone());
        
        // Limpiar caché después de la duración especificada
        setTimeout(() => {
          cache.delete(req.url);
        }, CACHE_DURATION);
      }
    })
  );
}
```

### 5. Interceptor de Loading

Muestra un indicador de carga durante las peticiones HTTP.

```typescript
import { HttpRequest, HttpHandlerFn, HttpEvent, HttpEventType } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

export function loadingInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const loadingService = inject(LoadingService);
  
  // Incrementar contador de peticiones activas
  loadingService.show();

  return next(req).pipe(
    finalize(() => {
      // Decrementar contador cuando la petición termine
      loadingService.hide();
    })
  );
}
```

**Servicio de Loading**:

```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private activeRequests = 0;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  
  loading$ = this.loadingSubject.asObservable();

  show(): void {
    this.activeRequests++;
    this.loadingSubject.next(true);
  }

  hide(): void {
    this.activeRequests--;
    if (this.activeRequests <= 0) {
      this.activeRequests = 0;
      this.loadingSubject.next(false);
    }
  }
}
```

**Componente que muestra el spinner**:

```typescript
@Component({
  selector: 'app-loading-spinner',
  template: `
    @if (loading$ | async) {
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-lg shadow-xl">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    }
  `,
  standalone: true,
  imports: [CommonModule]
})
export class LoadingSpinnerComponent {
  loading$ = inject(LoadingService).loading$;
}
```

### 6. Interceptor de Retry

Reintenta automáticamente peticiones fallidas.

```typescript
import { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, retry, mergeMap } from 'rxjs/operators';

export function retryInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const maxRetries = 3;
  const delayMs = 1000;

  return next(req).pipe(
    retry({
      count: maxRetries,
      delay: (error: HttpErrorResponse, retryCount) => {
        // Solo reintentar en ciertos errores
        if (error.status === 0 || error.status >= 500) {
          console.log(`Reintento ${retryCount} de ${maxRetries} para ${req.url}`);
          return timer(delayMs * retryCount); // Backoff exponencial
        }
        return throwError(() => error);
      }
    }),
    catchError((error: HttpErrorResponse) => {
      console.error(`Falló después de ${maxRetries} reintentos:`, error);
      return throwError(() => error);
    })
  );
}
```

### 7. Interceptor de URL Base

Agrega automáticamente la URL base a todas las peticiones.

```typescript
import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export function baseUrlInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  // Solo agregar URL base a rutas relativas
  if (req.url.startsWith('http://') || req.url.startsWith('https://')) {
    return next(req);
  }

  const apiReq = req.clone({
    url: `${environment.apiUrl}${req.url}`
  });

  return next(apiReq);
}
```

### 8. Interceptor de Timeout

Cancela peticiones que tarden demasiado.

```typescript
import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';

export function timeoutInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const timeoutDuration = 30000; // 30 segundos

  return next(req).pipe(
    timeout(timeoutDuration),
    catchError(error => {
      if (error instanceof TimeoutError) {
        console.error(`Timeout en petición a ${req.url}`);
        return throwError(() => new Error('La petición tardó demasiado tiempo'));
      }
      return throwError(() => error);
    })
  );
}
```

## Modificar Peticiones

Las peticiones HTTP son inmutables, por lo que debes clonarlas para modificarlas.

### Agregar Headers

```typescript
export function headersInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const modifiedReq = req.clone({
    setHeaders: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-App-Version': '1.0.0'
    }
  });

  return next(modifiedReq);
}
```

### Modificar URL y Parámetros

```typescript
export function urlInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const modifiedReq = req.clone({
    url: req.url.replace('/api/', '/api/v2/'),
    setParams: {
      timestamp: Date.now().toString()
    }
  });

  return next(modifiedReq);
}
```

### Modificar Body

```typescript
export function bodyInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  if (req.method === 'POST' || req.method === 'PUT') {
    const body = req.body as any;
    
    const modifiedReq = req.clone({
      body: {
        ...body,
        timestamp: new Date().toISOString(),
        version: '1.0'
      }
    });

    return next(modifiedReq);
  }

  return next(req);
}
```

## Interceptores Condicionales

Puedes aplicar lógica condicional para ejecutar interceptores solo en ciertas situaciones.

```typescript
export function conditionalInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  // Solo aplicar a ciertas URLs
  if (req.url.includes('/api/secure/')) {
    const token = localStorage.getItem('authToken');
    const modifiedReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(modifiedReq);
  }

  // Solo aplicar a ciertos métodos
  if (req.method === 'POST' || req.method === 'PUT') {
    const modifiedReq = req.clone({
      setHeaders: { 'X-Request-ID': crypto.randomUUID() }
    });
    return next(modifiedReq);
  }

  return next(req);
}
```

## Ejemplo Completo: Sistema de Interceptores

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

// Importar todos los interceptores
import { baseUrlInterceptor } from './interceptors/base-url.interceptor';
import { authInterceptor } from './interceptors/auth.interceptor';
import { loadingInterceptor } from './interceptors/loading.interceptor';
import { errorInterceptor } from './interceptors/error.interceptor';
import { loggingInterceptor } from './interceptors/logging.interceptor';
import { retryInterceptor } from './interceptors/retry.interceptor';
import { cacheInterceptor } from './interceptors/cache.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        baseUrlInterceptor,      // 1. Agregar URL base
        authInterceptor,         // 2. Agregar autenticación
        loadingInterceptor,      // 3. Mostrar loading
        cacheInterceptor,        // 4. Verificar caché
        retryInterceptor,        // 5. Reintentar si falla
        loggingInterceptor,      // 6. Logging
        errorInterceptor         // 7. Manejo de errores
      ])
    )
  ]
};
```

## Inyección de Dependencias en Interceptores

Puedes inyectar servicios en interceptores usando la función `inject()`.

```typescript
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export function advancedAuthInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);
  const notificationService = inject(NotificationService);

  if (!authService.isAuthenticated()) {
    notificationService.showError('Sesión expirada. Por favor inicie sesión');
    return throwError(() => new Error('No autenticado'));
  }

  const token = authService.getToken();
  const modifiedReq = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });

  return next(modifiedReq);
}
```

## Mejores Prácticas

### 1. Orden de Interceptores

El orden importa. Organiza tus interceptores de forma lógica:

```typescript
withInterceptors([
  baseUrlInterceptor,    // Primero: modificar URL
  authInterceptor,       // Segundo: agregar autenticación
  loadingInterceptor,    // Tercero: UI feedback
  cacheInterceptor,      // Cuarto: verificar caché
  retryInterceptor,      // Quinto: lógica de reintentos
  loggingInterceptor,    // Sexto: logging
  errorInterceptor       // Último: manejo de errores
])
```

### 2. Evitar Efectos Secundarios

```typescript
// Mal - modificar objeto compartido
export function badInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const sharedConfig = getConfig();
  sharedConfig.lastRequest = req.url; // Efecto secundario
  return next(req);
}

// Bien - inmutabilidad
export function goodInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  console.log('Petición:', req.url); // Solo logging
  return next(req);
}
```

### 3. Manejo Apropiado de Errores

```typescript
export function properErrorHandlingInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Logging del error
      console.error('Error en petición:', error);
      
      // No consumir el error, propagarlo
      return throwError(() => error);
    })
  );
}
```

### 4. Usar TypeScript para Tipos Seguros

```typescript
interface AuthRequest {
  username: string;
  password: string;
}

export function typedInterceptor(
  req: HttpRequest<AuthRequest>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  if (req.body) {
    console.log('Usuario:', req.body.username);
  }
  return next(req);
}
```

## Interceptores Basados en DI (Clase)

Aunque los interceptores funcionales son recomendados, también puedes usar interceptores basados en clases:

```typescript
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ClassBasedInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();
    
    if (token) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    return next.handle(req);
  }
}
```

**Configuración**:

```typescript
import { HTTP_INTERCEPTORS } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ClassBasedInterceptor,
      multi: true
    }
  ]
};
```

## Resumen

Los interceptores son middleware que interceptan peticiones HTTP antes de ser enviadas y respuestas antes de ser procesadas.

Angular 19 recomienda usar interceptores funcionales por su simplicidad y predecibilidad.

Los casos de uso comunes incluyen autenticación, logging, manejo de errores, caché y loading.

Los interceptores se configuran con `provideHttpClient` y `withInterceptors` en el orden deseado.

Las peticiones y respuestas son inmutables, usa el método `clone()` para modificarlas.

Puedes inyectar servicios en interceptores funcionales usando la función `inject()`.

Esta guía proporciona las bases para implementar interceptores HTTP efectivos en Angular 19.