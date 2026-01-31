import { HttpInterceptorFn } from '@angular/common/http';

const PUBLIC_ENDPOINTS = [
  '/autenticacao/login',
  '/autenticacao/refresh'
];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (PUBLIC_ENDPOINTS.some(url => req.url.includes(url))) {
    return next(req);
  }

  const token = localStorage.getItem('access_token');

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};
