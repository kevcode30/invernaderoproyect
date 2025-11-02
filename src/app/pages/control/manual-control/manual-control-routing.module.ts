import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManualControlPage } from './manual-control.page';

const routes: Routes = [
  {
    path: '',
    component: ManualControlPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManualControlPageRoutingModule {}
