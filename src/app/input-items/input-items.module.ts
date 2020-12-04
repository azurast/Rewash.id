import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { InputItemsPageRoutingModule } from './input-items-routing.module';
import { InputItemsPage } from './input-items.page';
import { IonicPullupModule } from 'ionic-pullup';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InputItemsPageRoutingModule,
    IonicPullupModule
  ],
  declarations: [InputItemsPage]
})
export class InputItemsPageModule {}
