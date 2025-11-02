import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SensorListPage } from './sensor-list.page';

const routes: Routes = [
  {
    path: '',
    component: SensorListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SensorListPageRoutingModule {}
