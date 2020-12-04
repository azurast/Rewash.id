import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OutletPageRoutingModule } from './outlet-routing.module';

import { OutletPage } from './outlet.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OutletPageRoutingModule
  ],
  declarations: [OutletPage]
})
export class OutletPageModule {}
