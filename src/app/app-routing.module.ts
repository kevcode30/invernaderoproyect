import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/auth/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/auth/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./pages/auth/forgot-password/forgot-password.module').then(m => m.ForgotPasswordPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'sensor-list',
    loadChildren: () => import('./pages/sensors/sensor-list/sensor-list.module').then(m => m.SensorListPageModule)
  },
  {
    path: 'sensor-detail',
    loadChildren: () => import('./pages/sensors/sensor-detail/sensor-detail.module').then(m => m.SensorDetailPageModule)
  },
  {
    path: 'sensor-history',
    loadChildren: () => import('./pages/sensors/sensor-history/sensor-history.module').then(m => m.SensorHistoryPageModule)
  },
  {
    path: 'manual-control',
    loadChildren: () => import('./pages/control/manual-control/manual-control.module').then(m => m.ManualControlPageModule)
  },
  {
    path: 'automatic',
    loadChildren: () => import('./pages/control/automatic/automatic.module').then(m => m.AutomaticPageModule)
  },
  {
    path: 'schedule',
    loadChildren: () => import('./pages/control/schedule/schedule.module').then(m => m.SchedulePageModule)
  },
  {
    path: 'greenhouse-list',
    loadChildren: () => import('./pages/greenhouse/greenhouse-list/greenhouse-list.module').then(m => m.GreenhouseListPageModule)
  },
  {
    path: 'greenhouse-detail',
    loadChildren: () => import('./pages/greenhouse/greenhouse-detail/greenhouse-detail.module').then(m => m.GreenhouseDetailPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/greenhouse/settings/settings.module').then(m => m.SettingsPageModule)
  },
  {
    path: 'alert-list',
    loadChildren: () => import('./pages/alerts/alert-list/alert-list.module').then(m => m.AlertListPageModule)
  },
  {
    path: 'alert-config',
    loadChildren: () => import('./pages/alerts/alert-config/alert-config.module').then(m => m.AlertConfigPageModule)
  },
  {
    path: 'report-list',
    loadChildren: () => import('./pages/reports/report-list/report-list.module').then(m => m.ReportListPageModule)
  },
  {
    path: 'charts',
    loadChildren: () => import('./pages/reports/charts/charts.module').then(m => m.ChartsPageModule)
  },
  {
    path: 'export',
    loadChildren: () => import('./pages/reports/export/export.module').then(m => m.ExportPageModule)
  },
  {
    path: 'profile-view',
    loadChildren: () => import('./pages/profile/profile-view/profile-view.module').then(m => m.ProfileViewPageModule)
  },
  {
    path: 'profile-edit',
    loadChildren: () => import('./pages/profile/profile-edit/profile-edit.module').then(m => m.ProfileEditPageModule)
  },
  {
    path: 'change-password',
    loadChildren: () => import('./pages/profile/change-password/change-password.module').then(m => m.ChangePasswordPageModule)
  },
  {
    path: 'preferences',
    loadChildren: () => import('./pages/profile/preferences/preferences.module').then(m => m.PreferencesPageModule)
  },
  { path: 'welcome', 
    loadComponent: () => import('./pages/welcome/welcome.page').then(m => m.WelcomePage) 
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
