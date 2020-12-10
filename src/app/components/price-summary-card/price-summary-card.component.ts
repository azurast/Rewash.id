import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {OrderDetail} from '../../../constants/order-model';
import {registerLocaleData} from '@angular/common';
import localeId from '@angular/common/locales/id';
import {OrderService} from '../../services/order/order.service';
import {Subscription} from 'rxjs';
import {AlertController} from '@ionic/angular';
import {OutletService} from "../../services/outlets/outlet.service";
import {UserService} from "../../services/users/user.service";

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
  outletId: string;
  outletName: string;
  userLocation: string;

  constructor(
    public orderService: OrderService,
    public router: Router,
    private alertController: AlertController,
    private outletService: OutletService,
    private userService: UserService
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
    this.minDeliveryDate = this.addDays(new Date(this.pickupDate), 1).toISOString();
    this.maxDeliveryDate = this.addDays(new Date(this.pickupDate), 7).toISOString();
    this.deliveryDate = this.minDeliveryDate;
  }

  changeDeliveryDate(newDeliveryDate: string) {
    this.deliveryDate = newDeliveryDate;
  }

  ngOnInit() {
    this.userLocation = this.orderService.getOrderDetail()[3];
    this.outletId = this.orderService.getOrderDetail()[0];
    this.outletName = this.outletService.getOutlet(this.outletId).name
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

  ionViewWillEnter() {
  }

  updateOrderDetail() {
    this.orderDetail.DETAIL.SHIPPING.PICKUPTD = this.pickupDate;
    this.orderDetail.DETAIL.SHIPPING.DELIVERYTD = this.deliveryDate;
    this.orderDetail.DETAIL.SHIPPING.ORIGIN = this.userLocation;
    this.orderDetail.DETAIL.SHIPPING.OUTLETID = this.outletId;
    this.orderDetail.DETAIL.SHIPPING.DESTINATION = this.outletName;
    this.orderService.setOrderData(this.orderDetail);
  }

  addToDb() {
    this.orderService.addToDb(this.orderDetail, this.userService.getLoggedUser());
  }

  onNextClick() {
    switch (this.router.url) {
      case '/input-items': {
        this.router.navigate(['/laundry-details']);
        break;
      }
      case '/laundry-details': {
        this.router.navigate(['/delivery-details']);
        break;
      }
      case '/delivery-details': {
        this.updateOrderDetail();
        this.addToDb();
        this.router.navigate(['/tabs/tab1']);
        break;
      }
    }
  }


  cartEmpty() {
    if (this.orderDetail.DETAIL.PRICE.every((item) => item.PRICE <= 0)) {
      return true;
    } else {
      return false;
    }
  }
}
