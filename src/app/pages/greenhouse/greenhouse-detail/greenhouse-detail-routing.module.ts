import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GreenhouseDetailPage } from './greenhouse-detail.page';

const routes: Routes = [
  {
    path: '',
    component: GreenhouseDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GreenhouseDetailPageRoutingModule {}
