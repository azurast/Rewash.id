import {Component, HostBinding, OnChanges, OnDestroy, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { OrderDetail } from '../../../constants/order-model';
import { CurrencyPipe } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeId from '@angular/common/locales/id';
import { OrderService } from '../../services/order/order.service';
import { Subscription } from 'rxjs';
registerLocaleData(localeId, 'id');

@Component({
  selector: 'app-price-summary-card',
  templateUrl: './price-summary-card.component.html',
  styleUrls: ['./price-summary-card.component.scss']
})

export class PriceSummaryCardComponent implements OnInit {
  orderDetail: OrderDetail;
  orderDetailSub: Subscription;
  todayDate: Date;
  maxDeliveryDate: string;
  minDeliveryDate: string;
  allowedHourValues: string;
  allowedMinuteValues: string;
  pickupDate: string;
  deliveryDetailPage: boolean;
  isObjEmpty: any;

  constructor(
      public orderService: OrderService,
      public router: Router
  ) {
    // this.orderService.orderDataStreams.subscribe((orderData) => {
    //   console.log('===orderData', orderData);
    //   this.orderDetail = orderData;
    // });
  }

  addDays(date, days) {
    const copy = new Date(Number(date));
    copy.setDate(date.getDate() + days);
    return copy;
  }

  changePickupDate(newPickupDate: string) {
    this.pickupDate = newPickupDate;
    // Calculate min & max delivery date
    this.minDeliveryDate = this.addDays(new Date(this.pickupDate), 1).toISOString().slice(0, 10);
    this.maxDeliveryDate = this.addDays(new Date(this.pickupDate), 7).toISOString().slice(0, 10);
  }

  ngOnInit() {
    if (this.router.url === '/delivery-details') {
      this.deliveryDetailPage = true;
    } else {
      this.deliveryDetailPage = false;
    }
    this.orderDetailSub = this.orderService.getOrderData()
        .subscribe((orderData) => {
          this.orderDetail = orderData;
        });
    this.allowedHourValues = '7,8,9,10,11,12,13,14,15,16,17,18';
    this.allowedMinuteValues = '0,15,30,45';
    // Get today's date as minimum pickup date
    this.todayDate = new Date();
    this.pickupDate = this.todayDate.toISOString();
    this.changePickupDate(this.pickupDate);
  }

  onNextClick() {
    // // console.log('this.router.url', this.router.url);
    switch (this.router.url) {
      case '/input-items': {
        // alert('=== mau ke laundry details');
        this.router.navigate(['/laundry-details']);
        break;
      }
      case '/laundry-details': {
        // alert('=== mau ke delivery details');
        this.router.navigate(['/delivery-details']);
        break;
      }
      case '/delivery-details': {
        alert('=== mau ke splashscreen loading');
        break;
      }
    }
  }

}
