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
      import('./components/login/login')
        .then(m => m.Login)
  },

  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/dashboard/dashboard')
        .then(m => m.Dashboard),
    children: [
      {
        path: '',
        redirectTo: 'pets',
        pathMatch: 'full'
      },
      {
        path: 'pets',
        loadComponent: () =>
          import('./components/pet/pet')
            .then(m => m.Pet)
      }
    ]
  },

  {
    path: '**',
    redirectTo: 'login'
  }
];
