import { Component, OnInit } from '@angular/core';
import { OrderDetail } from '../../constants/order-model';
import { registerLocaleData } from '@angular/common';
import localeId from '@angular/common/locales/id';
import { OTHER_PRICE } from '../../constants/other-price';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { User } from '../services/users/user';
import { UserService } from '../services/users/user.service';

registerLocaleData(localeId, 'id');

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.page.html',
  styleUrls: ['./order-detail.page.scss'],
})

export class OrderDetailPage implements OnInit {
  orderDetail: OrderDetail;
  priceTotal: number;
  shippingInfo: any;
  OTHERS_PRICE: number;
  user: User;

  constructor(
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private alertController: AlertController,
    private db: AngularFireDatabase,
    private userService: UserService
  ) {
  }

  formatDateAndTime(shippingInfo: object) {
    // @ts-ignore
    const pickupDate = new Date(shippingInfo.PICKUPTD);
    // @ts-ignore
    const deliveryDate = new Date(shippingInfo.DELIVERYTD);
    return {
      PICKUPTD: pickupDate.toDateString() + ' ' + pickupDate.toLocaleTimeString(),
      DELIVERYTD: deliveryDate.toDateString() + ' ' + deliveryDate.toLocaleTimeString()
    };
  }

  ngOnInit(): void {
    this.user = this.userService.getLoggedInUser();
    this.OTHERS_PRICE = OTHER_PRICE;
    this.activatedRoute.queryParams.subscribe(params => {
      this.orderDetail = JSON.parse(params.data);
      this.priceTotal = this.orderDetail.DETAIL.PRICE.find((each) => each.NAME === 'Total Order Price').PRICE;
      this.shippingInfo = this.formatDateAndTime(this.orderDetail.DETAIL.SHIPPING);
    });
  }

  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      animated: true,
      backdropDismiss: true,
      header: 'Complete Order?',
      message: 'Enjoy your freshly cleaned clothes!\n' + 'How did you like the\n' + 'service?',
      inputs: [
        {
          name: 'rating',
          type: 'number',
          placeholder: '1-5 *Required'
        },
        {
          name: 'feedback',
          id: 'feedback',
          type: 'textarea',
          placeholder: 'Anything you wanna tell us?'
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
        }, {
          text: 'Ok',
          handler: (data) => {
            if (data.rating !== '') {
              const {rating, feedback} = data;
              /* Buat nampung previous values nya
              * OUTLET :
              *   prevRating (points)
              *   transactionCount (transactions)
              * ORDER :
              *   prevProgress (DETAIL.PROGRESS)
              *   index (index order si pengguna yang mau diubah)
              * */
              let prevRating;
              let transactionCount;
              let prevProgress;
              let index;
              /* Kalau complete order semuanya kan harus true,
              * jadi temp object utk set semua STATUS dlm array jadi true kemudian dikirim buat di update
              * */
              const newProgress = [];
              // Outlet Reference
              const outletRef = this.db.database.ref('outlet/' + this.orderDetail.DETAIL.SHIPPING.OUTLETID);
              // Order Reference
              const orderRef = this.db.database.ref('orders/' + this.user.id)
                .orderByChild('DETAIL/ORDERID')
                .equalTo(this.orderDetail.DETAIL.ORDERID);
              try {
                // Set all PROGRESS STATUS to TRUE
                // orderRef.once('value').then((dataSnapshot) => {
                //   console.log(dataSnapshot.val())
                //   index = dataSnapshot.val().findIndex((obj) => obj?.DETAIL !== undefined);
                //   console.log("try", (dataSnapshot.val())[0].DETAIL.PROGRESS)
                //   prevProgress = dataSnapshot.val()[0].DETAIL.PROGRESS;
                // }).then(() => {
                //   prevProgress.forEach((item) => {
                //     newProgress.push({
                //       NAME: item.NAME,
                //       STATUS: true
                //     });
                //   });
                //   this.db.database.ref('orders/' + this.user.id.concat(`/${index}/DETAIL`))
                //     .update({
                //       PROGRESS: newProgress
                //     });
                // });
                // Update data mengenai outlet setelah mendapatkan feedback & rating
                for (let i = 0; i <= 7; i++) {
                  this.db.database.ref('orders/' + this.user.id.concat(`/${this.orderDetail.id}/DETAIL/PROGRESS/${i}`))
                    .update({
                      STATUS: true
                    });
                }
                this.db.database.ref('orders/' + this.user.id.concat(`/${this.orderDetail.id}`)).update({
                  finished: true
                });
                outletRef.once('value').then((dataSnaphot) => {
                  prevRating = dataSnaphot.val().points;
                  transactionCount = dataSnaphot.val().transactions;
                }).then(() => {
                  outletRef.update({
                    // tslint:disable-next-line:radix
                    points: (prevRating + parseInt(rating)),
                    transactions: ++transactionCount
                  });
                  outletRef.child('feedbacks').push(feedback);
                });
              } catch (e) {
                // console.log('===Error', e);
              } finally {
                this.navCtrl.navigateBack('/tabs/tab1');
              }
            }
          }
        }
      ]
    });

    await alert.present();
  }

  onComplete() {
    this.presentAlertPrompt();
  }
}
