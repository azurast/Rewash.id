import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OutletDetailPageRoutingModule } from './outlet-detail-routing.module';

import { OutletDetailPage } from './outlet-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OutletDetailPageRoutingModule
  ],
  declarations: [OutletDetailPage]
})
export class OutletDetailPageModule {}
