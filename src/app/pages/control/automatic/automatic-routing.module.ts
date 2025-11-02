import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AutomaticPage } from './automatic.page';

const routes: Routes = [
  {
    path: '',
    component: AutomaticPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AutomaticPageRoutingModule {}
