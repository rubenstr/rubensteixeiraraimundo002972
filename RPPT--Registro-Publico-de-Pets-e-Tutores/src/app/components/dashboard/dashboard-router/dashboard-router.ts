import { Routes } from '@angular/router';
import { Dashboard } from '../dashboard';
import { Pet } from '../../pet/pet';
import { Tutor } from '../../tutor/tutor';
import { authGuard } from '../../../core/guards/auth-guard';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: Dashboard,
    canMatch: [authGuard],
    children: [
      { path: 'pets', component: Pet },
      { path: 'tutores', component: Tutor },
      { path: '', redirectTo: 'pets', pathMatch: 'full' }
    ]
  }
];