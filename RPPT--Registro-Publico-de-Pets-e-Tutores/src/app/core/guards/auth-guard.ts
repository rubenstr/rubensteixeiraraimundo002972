import { CanMatchFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AutenticacaoService } from '../services/autenticacao.service';

export const authGuard: CanMatchFn = () => {
  const authService = inject(AutenticacaoService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};