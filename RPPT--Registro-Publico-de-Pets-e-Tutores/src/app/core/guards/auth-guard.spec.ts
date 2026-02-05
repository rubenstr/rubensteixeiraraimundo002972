import { TestBed } from '@angular/core/testing';
import { authGuard } from './auth-guard';
import { Router } from '@angular/router';

describe('AuthGuard', () => {
  it('deve permitir acesso quando autenticado', () => {
    TestBed.runInInjectionContext(() => {
      const result = authGuard({} as any, {} as any);
      expect(result).toBeTrue();
    });
  });
});