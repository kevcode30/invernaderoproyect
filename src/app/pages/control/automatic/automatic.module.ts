import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AutomaticPageRoutingModule } from './automatic-routing.module';

import { AutomaticPage } from './automatic.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AutomaticPageRoutingModule
  ],
  
})
export class AutomaticPageModule {}
