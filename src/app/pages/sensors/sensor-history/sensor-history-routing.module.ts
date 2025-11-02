import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SensorHistoryPage } from './sensor-history.page';

const routes: Routes = [
  {
    path: '',
    component: SensorHistoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SensorHistoryPageRoutingModule {}
