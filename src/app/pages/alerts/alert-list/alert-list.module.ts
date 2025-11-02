import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlertListPageRoutingModule } from './alert-list-routing.module';

import { AlertListPage } from './alert-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlertListPageRoutingModule
  ],
  
})
export class AlertListPageModule {}
