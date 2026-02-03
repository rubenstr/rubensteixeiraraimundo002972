import { CanMatchFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { AutenticacaoService } from '../services/autenticacao.service';

export const authGuard: CanMatchFn = () => {
  return true; // deixa passar
};