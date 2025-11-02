import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GreenhouseDetailPageRoutingModule } from './greenhouse-detail-routing.module';

import { GreenhouseDetailPage } from './greenhouse-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GreenhouseDetailPageRoutingModule
  ],
 
})
export class GreenhouseDetailPageModule {}
