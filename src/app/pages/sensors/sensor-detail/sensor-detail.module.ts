import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SensorDetailPageRoutingModule } from './sensor-detail-routing.module';

import { SensorDetailPage } from './sensor-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SensorDetailPageRoutingModule
  ],

})
export class SensorDetailPageModule {}
