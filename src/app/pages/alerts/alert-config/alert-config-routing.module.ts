import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlertConfigPage } from './alert-config.page';

const routes: Routes = [
  {
    path: '',
    component: AlertConfigPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlertConfigPageRoutingModule {}
