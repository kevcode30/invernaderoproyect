import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SensorListPageRoutingModule } from './sensor-list-routing.module';

import { SensorListPage } from './sensor-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SensorListPageRoutingModule
  ],

})
export class SensorListPageModule {}
