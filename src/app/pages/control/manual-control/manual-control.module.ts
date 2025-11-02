import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManualControlPageRoutingModule } from './manual-control-routing.module';

import { ManualControlPage } from './manual-control.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManualControlPageRoutingModule
  ],
 
})
export class ManualControlPageModule {}
