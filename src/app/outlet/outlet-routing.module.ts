import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OutletPage } from './outlet.page';
const routes: Routes = [
  {
    path: '',
    component: OutletPage
  },
  {
    path: ':outletId',
    loadChildren: () => import('./outlet-detail/outlet-detail.module').then( m => m.OutletDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OutletPageRoutingModule {}
