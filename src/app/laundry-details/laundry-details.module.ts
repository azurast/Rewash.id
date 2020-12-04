import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LaundryDetailsPageRoutingModule } from './laundry-details-routing.module';
import { LaundryDetailsPage } from './laundry-details.page';
import { IonicPullupModule } from 'ionic-pullup';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LaundryDetailsPageRoutingModule,
    IonicPullupModule
  ],
  declarations: [LaundryDetailsPage]
})
export class LaundryDetailsPageModule {}
