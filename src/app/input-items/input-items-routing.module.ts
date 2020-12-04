import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InputItemsPage } from './input-items.page';
import { InputDropdownComponent } from '../components/input-dropdown/input-dropdown.component';
import { PriceSummaryCardComponent } from '../components/price-summary-card/price-summary-card.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: InputItemsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
  entryComponents: [InputDropdownComponent, PriceSummaryCardComponent],
  declarations: [InputDropdownComponent, PriceSummaryCardComponent],
  exports: [RouterModule, InputDropdownComponent, PriceSummaryCardComponent],
})
export class InputItemsPageRoutingModule {}
