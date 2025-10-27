import { ApplicationConfig, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, HTTP_INTERCEPTORS, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptor } from './shared/auth.interceptor';
import { routes } from './app.routes';
// NgRx Imports - Nuevas dependencias para el state management
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
// Importar nuestro reducer y effects de auth
import { AuthEffects } from './store/auth/auth.effects';
import { authReducer } from './store/auth/auth.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    // NgRx Configuration - Configuración del state management

    // Store: El contenedor central del estado de la app
    // Registra el reducer 'auth' → maneja el estado de autenticación
    provideStore({ auth: authReducer }),
    // Effects: Maneja efectos laterales (HTTP calls, etc.)
    // Registra AuthEffects → maneja la lógica de carga de usuario
    provideEffects([AuthEffects]),
    // DevTools: Herramientas de desarrollo para debugging
    // Solo en desarrollo → permite inspeccionar acciones y estado
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ]
};
