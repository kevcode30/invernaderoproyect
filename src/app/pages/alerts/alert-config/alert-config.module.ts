import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlertConfigPageRoutingModule } from './alert-config-routing.module';

import { AlertConfigPage } from './alert-config.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlertConfigPageRoutingModule
  ],
  
})
export class AlertConfigPageModule {}
