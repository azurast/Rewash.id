import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OutletPageRoutingModule } from './outlet-routing.module';

import { OutletPage } from './outlet.page';
import {GooglePlaceModule} from "ngx-google-places-autocomplete";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OutletPageRoutingModule,
    GooglePlaceModule
  ],
  declarations: [OutletPage]
})
export class OutletPageModule {}
