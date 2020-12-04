import { ALL_SCENT } from '../../../constants/scent-list';
import { SCENT } from '../../../constants/scent-model';
import { Component, OnInit } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeId from '@angular/common/locales/id';
import {FormGroup, FormControl, Validators } from '@angular/forms';
import {OrderService} from '../../services/order/order.service';
registerLocaleData(localeId, 'id');

@Component({
  selector: 'app-laundry-selection',
  templateUrl: './laundry-selection.component.html',
  styleUrls: ['./laundry-selection.component.scss'],
})
export class LaundrySelectionComponent implements OnInit {
  AllScents: Array<SCENT> = [];
  laundryDetailsForm: FormGroup;
  constructor(
      private orderService: OrderService
  ) { }

  ngOnInit() {
    this.AllScents = ALL_SCENT.SCENTS;
    this.laundryDetailsForm = new FormGroup({
      scent: new FormControl(null, Validators.required),
      bag: new FormControl(null),
      notes: new FormControl(null)
    });
  }

  updateLaundryDetails(value: any) {
    console.log('===value', value);
    this.orderService.setOrderData(value);
  }
}
