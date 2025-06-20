import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PanelComponent } from './pages/panel/panel.component';
import { AdminPanelComponent } from './pages/admin-panel/admin-panel.component';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: LoginComponent,
  },
  {
    path: 'dashboard',
    pathMatch: 'full',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['user', 'admin', 'guest'] },
  },
  {
    path: 'panel',
    pathMatch: 'full',
    component: PanelComponent,
    canActivate: [AuthGuard],
    data: { roles: ['user', 'admin'] },
  },
  {
    path: 'admin',
    pathMatch: 'full',
    component: AdminPanelComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] },
  },
  {
    path: 'unauthorized',
    pathMatch: 'full',
    component: UnauthorizedComponent,
  },
];
