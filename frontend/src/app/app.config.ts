import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Optimización de detección de cambios
    provideZoneChangeDetection({ eventCoalescing: true }),
    
    // Configuración del router
    provideRouter(routes),
    
    // Cliente HTTP para comunicación con la API
    provideHttpClient(withInterceptorsFromDi()),
    
    // Animaciones para ng-bootstrap
    provideAnimations()
  ]
};
