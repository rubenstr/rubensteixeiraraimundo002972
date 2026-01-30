import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login').then(l => l.Login)
  },
  {
    path: '',
    loadComponent: () =>
      import('./components/dashboard/dashboard').then(d => d.Dashboard),
    children: [
      {
        path: 'pets',
        loadComponent: () =>
          import('./components/pet/pet').then(p => p.Pet)
      },
      {
        path: 'tutors',
        loadComponent: () =>
          import('./components/tutor/tutor').then(t => t.Tutor)
      }
    ]
  }
];
