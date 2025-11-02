import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GreenhouseListPageRoutingModule } from './greenhouse-list-routing.module';

import { GreenhouseListPage } from './greenhouse-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GreenhouseListPageRoutingModule
  ],
 
})
export class GreenhouseListPageModule {}
