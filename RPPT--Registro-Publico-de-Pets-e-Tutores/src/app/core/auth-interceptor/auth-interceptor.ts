import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AutenticacaoService } from '../services/autenticacao.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AutenticacaoService);

  // Bypass para endpoints públicos
  const PUBLIC_ENDPOINTS = ['/autenticacao/login', '/autenticacao/refresh'];
  if (PUBLIC_ENDPOINTS.some(url => req.url.includes(url))) {
    return next(req);
  }

  const token = authService.token;
  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && authService.refreshToken) {
        return authService.refreshTokenRequest().pipe(
          switchMap(() => {
            const newToken = authService.token;
            const newReq = req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } });
            return next(newReq);
          }),
          catchError(innerErr => {
            authService.logout();
            return throwError(() => innerErr);
          })
        );
      }
      return throwError(() => err);
    })
  );
};
