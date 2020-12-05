import { Component, HostBinding, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderDetail } from '../../../constants/order-model';
import { CurrencyPipe } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeId from '@angular/common/locales/id';
import { OrderService } from '../../services/order/order.service';
import { Subscription } from 'rxjs';
import { AlertController } from '@ionic/angular';
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
  deliveryDate: string;
  deliveryDetailPage: boolean;
  isObjEmpty: any;
  constructor(
      public orderService: OrderService,
      public router: Router,
      private alertController: AlertController
  ) {
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
    this.deliveryDate = this.minDeliveryDate;
  }

  changeDeliveryDate(newDeliveryDate: string) {
    this.deliveryDate = newDeliveryDate;
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
    // console.log('===orderDetail', this.orderDetail);
    this.allowedHourValues = '7,8,9,10,11,12,13,14,15,16,17,18';
    this.allowedMinuteValues = '0,15,30,45';
    // Get today's date as minimum pickup date
    this.todayDate = new Date();
    this.pickupDate = this.todayDate.toISOString();
    this.changePickupDate(this.pickupDate);
  }

  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      animated: true,
      backdropDismiss: true,
      header: 'Note to driver',
      inputs: [
        {
          name: 'shippingnote',
          id: 'textarea',
          type: 'textarea',
          placeholder: 'Tell us about your location!'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            alert.dismiss();
          }
        },
        {
          text: 'Save',
          role: 'submit',
          handler: (data) => {
            this.orderDetail.DETAIL.SHIPPING.NOTES = data.shippingnote;
          }
        }
      ]
    });
    await alert.present();
  }

  openModal() {
    this.presentAlertPrompt();
  }

  updateOrderDetail() {
    this.orderDetail.DETAIL.SHIPPING.PICKUPTD = this.pickupDate;
    this.orderDetail.DETAIL.SHIPPING.DELIVERYTD = this.deliveryDate;
    this.orderService.setOrderData(this.orderDetail);
  }

  addToDb() {
    this.orderService.addToDb(this.orderDetail);
  }

  onNextClick() {
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
        this.updateOrderDetail();
        this.addToDb();
        alert('=== mau ke splashscreen loading');
        break;
      }
    }
  }


}
