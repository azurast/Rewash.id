import { ALL_SCENT } from '../../../constants/scent-list';
import { SCENT } from '../../../constants/scent-model';
import { Component, OnInit } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeId from '@angular/common/locales/id';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OrderService } from '../../services/order/order.service';
import { OrderDetail } from '../../../constants/order-model';
import { Subscription } from 'rxjs';
registerLocaleData(localeId, 'id');

@Component({
  selector: 'app-laundry-selection',
  templateUrl: './laundry-selection.component.html',
  styleUrls: ['./laundry-selection.component.scss'],
})
export class LaundrySelectionComponent implements OnInit {
  AllScents: Array<SCENT> = [];
  laundryDetailsForm: FormGroup;
  orderDetail: OrderDetail;
  orderDetailSub: Subscription;

  constructor(
      private orderService: OrderService
  ) {}

  ngOnInit() {
    this.AllScents = ALL_SCENT.SCENTS;
    this.orderDetailSub = this.orderService.getOrderData()
      .subscribe((orderData) => {
        this.orderDetail = orderData;
      });
    this.laundryDetailsForm = new FormGroup({
      scent: new FormControl(null, Validators.required),
      bag: new FormControl(null),
      notes: new FormControl(null)
    });
    this.laundryDetailsForm.valueChanges.subscribe((data: any) => {
      this.updateLaundryDetails(data)
    })
  }

  updateLaundryDetails(value: any) {
    this.orderDetail.DETAIL.ADDITIONALS = {
      SCENT: value.scent,
      REQUEST_BAG: value.bag,
      NOTES: value.notes
    };
    if (value.bag === true) {
      this.orderDetail.DETAIL.PRICE[4].PRICE += 5000;
    }
    this.orderService.setOrderData(this.orderDetail);
  }
}
