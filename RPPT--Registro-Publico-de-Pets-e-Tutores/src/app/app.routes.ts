import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./components/login/login').then(m => m.Login) },
  
  {
    path: 'dashboard',
    loadChildren: () => import('./components/dashboard/dashboard-router/dashboard-router').then(m => m.DASHBOARD_ROUTES)
  },

  { path: '**', redirectTo: 'login' }
];
