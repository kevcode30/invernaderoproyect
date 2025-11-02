import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GreenhouseListPage } from './greenhouse-list.page';

const routes: Routes = [
  {
    path: '',
    component: GreenhouseListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GreenhouseListPageRoutingModule {}
