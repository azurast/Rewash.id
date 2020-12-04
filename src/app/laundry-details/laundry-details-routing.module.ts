import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { LaundrySelectionComponent } from '../components/laundry-selection/laundry-selection.component';
import { LaundryDetailsPage } from './laundry-details.page';
import { PriceSummaryCardComponent } from '../components/price-summary-card/price-summary-card.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
const routes: Routes = [
  {
    path: '',
    component: LaundryDetailsPage
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes), IonicModule, CommonModule, ReactiveFormsModule],
  entryComponents: [LaundrySelectionComponent, PriceSummaryCardComponent],
  declarations: [LaundrySelectionComponent, PriceSummaryCardComponent],
  exports: [RouterModule, LaundrySelectionComponent, PriceSummaryCardComponent],
})
export class LaundryDetailsPageRoutingModule {}
