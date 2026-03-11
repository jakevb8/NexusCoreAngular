import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { GuestGuard } from './guards/guest.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then((m) => m.LoginModule),
    canActivate: [GuestGuard],
  },
  {
    path: 'onboarding',
    loadChildren: () => import('./pages/onboarding/onboarding.module').then((m) => m.OnboardingModule),
  },
  {
    path: 'pending-approval',
    loadChildren: () =>
      import('./pages/pending-approval/pending-approval.module').then((m) => m.PendingApprovalModule),
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'assets',
    loadChildren: () => import('./pages/assets/assets.module').then((m) => m.AssetsModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'team',
    loadChildren: () => import('./pages/team/team.module').then((m) => m.TeamModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'reports',
    loadChildren: () => import('./pages/reports/reports.module').then((m) => m.ReportsModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'events',
    loadChildren: () => import('./pages/events/events.module').then((m) => m.EventsModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then((m) => m.SettingsModule),
    canActivate: [AuthGuard],
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
