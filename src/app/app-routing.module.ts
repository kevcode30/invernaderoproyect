// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full'
  },
  // Rutas de autenticación
  {
    path: 'auth',
    children: [
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
      }
    ]
  },

  {
    path: 'login',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: 'register',
    redirectTo: 'auth/register',
    pathMatch: 'full'
  },
  {
    path: 'forgot-password',
    redirectTo: 'auth/forgot-password',
    pathMatch: 'full'
  },
 
  {
    path: 'welcome', 
    loadComponent: () => import('./pages/welcome/welcome.page').then(m => m.WelcomePage) 
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
  },
 
  {
    path: 'sensors',
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        loadChildren: () => import('./pages/sensors/sensor-list/sensor-list.module').then(m => m.SensorListPageModule)
      },
      {
        path: 'detail',
        loadChildren: () => import('./pages/sensors/sensor-detail/sensor-detail.module').then(m => m.SensorDetailPageModule)
      },
      {
        path: 'history',
        loadChildren: () => import('./pages/sensors/sensor-history/sensor-history.module').then(m => m.SensorHistoryPageModule)
      }
    ]
  },
  
  {
    path: 'sensor-list',
    redirectTo: 'sensors/list',
    pathMatch: 'full'
  },
  {
    path: 'sensor-detail',
    redirectTo: 'sensors/detail',
    pathMatch: 'full'
  },
  {
    path: 'sensor-history',
    redirectTo: 'sensors/history',
    pathMatch: 'full'
  },

  {
    path: 'control',
    children: [
      {
        path: '',
        redirectTo: 'manual',
        pathMatch: 'full'
      },
      {
        path: 'manual',
        loadChildren: () => import('./pages/control/manual-control/manual-control.module').then(m => m.ManualControlPageModule)
      },
      {
        path: 'automatic',
        loadChildren: () => import('./pages/control/automatic/automatic.module').then(m => m.AutomaticPageModule)
      },
      {
        path: 'schedule',
        loadChildren: () => import('./pages/control/schedule/schedule.module').then(m => m.SchedulePageModule)
      }
    ]
  },
  
  {
    path: 'manual-control',
    redirectTo: 'control/manual',
    pathMatch: 'full'
  },
  {
    path: 'automatic',
    redirectTo: 'control/automatic',
    pathMatch: 'full'
  },
  {
    path: 'schedule',
    redirectTo: 'control/schedule',
    pathMatch: 'full'
  },
  
  {
    path: 'greenhouse',
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        loadChildren: () => import('./pages/greenhouse/greenhouse-list/greenhouse-list.module').then(m => m.GreenhouseListPageModule)
      },
      {
        path: 'detail',
        loadChildren: () => import('./pages/greenhouse/greenhouse-detail/greenhouse-detail.module').then(m => m.GreenhouseDetailPageModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('./pages/greenhouse/settings/settings.module').then(m => m.SettingsPageModule)
      }
    ]
  },
  
  {
    path: 'greenhouse-list',
    redirectTo: 'greenhouse/list',
    pathMatch: 'full'
  },
  {
    path: 'greenhouse-detail',
    redirectTo: 'greenhouse/detail',
    pathMatch: 'full'
  },
  {
    path: 'settings',
    redirectTo: 'greenhouse/settings',
    pathMatch: 'full'
  },

  {
    path: 'alerts',
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        loadChildren: () => import('./pages/alerts/alert-list/alert-list.module').then(m => m.AlertListPageModule)
      },
      {
        path: 'config',
        loadChildren: () => import('./pages/alerts/alert-config/alert-config.module').then(m => m.AlertConfigPageModule)
      }
    ]
  },
 
  {
    path: 'alert-list',
    redirectTo: 'alerts/list',
    pathMatch: 'full'
  },
  {
    path: 'alert-config',
    redirectTo: 'alerts/config',
    pathMatch: 'full'
  },
  
  {
    path: 'reports',
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        loadChildren: () => import('./pages/reports/report-list/report-list.module').then(m => m.ReportListPageModule)
      },
      {
        path: 'charts',
        loadChildren: () => import('./pages/reports/charts/charts.module').then(m => m.ChartsPageModule)
      },
      {
        path: 'export',
        loadChildren: () => import('./pages/reports/export/export.module').then(m => m.ExportPageModule)
      }
    ]
  },
  
  {
    path: 'report-list',
    redirectTo: 'reports/list',
    pathMatch: 'full'
  },
  {
    path: 'charts',
    redirectTo: 'reports/charts',
    pathMatch: 'full'
  },
  {
    path: 'export',
    redirectTo: 'reports/export',
    pathMatch: 'full'
  },
  
  {
    path: 'profile',
    children: [
      {
        path: '',
        redirectTo: 'view',
        pathMatch: 'full'
      },
      {
        path: 'view',
        loadChildren: () => import('./pages/profile/profile-view/profile-view.module').then(m => m.ProfileViewPageModule)
      },
      {
        path: 'edit',
        loadChildren: () => import('./pages/profile/profile-edit/profile-edit.module').then(m => m.ProfileEditPageModule)
      },
      {
        path: 'change-password',
        loadChildren: () => import('./pages/profile/change-password/change-password.module').then(m => m.ChangePasswordPageModule)
      },
      {
        path: 'preferences',
        loadChildren: () => import('./pages/profile/preferences/preferences.module').then(m => m.PreferencesPageModule)
      }
    ]
  },
  {
    path: 'profile-view',
    redirectTo: 'profile/view',
    pathMatch: 'full'
  },
  {
    path: 'profile-edit',
    redirectTo: 'profile/edit',
    pathMatch: 'full'
  },
  {
    path: 'change-password',
    redirectTo: 'profile/change-password',
    pathMatch: 'full'
  },
  {
    path: 'preferences',
    redirectTo: 'profile/preferences',
    pathMatch: 'full'
  },
  
  {
    path: '**',
    redirectTo: 'welcome',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }