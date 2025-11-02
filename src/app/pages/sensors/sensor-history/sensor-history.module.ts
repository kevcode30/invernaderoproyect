import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SensorHistoryPageRoutingModule } from './sensor-history-routing.module';

import { SensorHistoryPage } from './sensor-history.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SensorHistoryPageRoutingModule
  ],

})
export class SensorHistoryPageModule {}
