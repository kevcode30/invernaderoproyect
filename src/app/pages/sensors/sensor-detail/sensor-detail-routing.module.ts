import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SensorDetailPage } from './sensor-detail.page';

const routes: Routes = [
  {
    path: '',
    component: SensorDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SensorDetailPageRoutingModule {}
