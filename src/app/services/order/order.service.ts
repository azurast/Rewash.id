import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { OrderDetail } from '../../../constants/order-model';
import { Router } from '@angular/router';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private dbPath = '/orders';
  ordersRef: AngularFireList<OrderDetail> = null;
  dbRef: any;
  orderDataSource = new BehaviorSubject<OrderDetail>({
    // TODO PAS NGE SET LOKASI PICKUP & DELIVERY JGN LUPA SET CURRENT USER ID
    id: 'ONuPibfPl1aHoQRF0RDb2h7XOPS2',
    finished: false,
    NORMAL: [],
    SPECIAL: [],
    OTHERS: [],
    DETAIL: {
      ORDERID: '',
      //  GET FROM LAUNDRY DETAILS PAGE
      ADDITIONALS: {
        SCENT: '',
        REQUEST_BAG: false,
        NOTES: ''
      },
      // GET FROM INPUT ITEMS PAGE
      PRICE: [
        {
          NAME: 'Special Items Total Price',
          PRICE: 0
        },
        {
          NAME: 'Normal Items Total Price',
          PRICE: 0
        },
        {
          NAME: 'Other Items Total Price',
          PRICE: 0
        },
        {
          NAME: 'Delivery Fee',
          PRICE: 0
        },
        {
          NAME: 'Total Order Price',
          PRICE: 0
        },
      ],
      WEIGHT: {
        normalItemsEstWeightTotal: 0,
        specialItemsEstWeightTotal: 0
      },
      SHIPPING: {
        DELIVERYTD: '',
        PICKUPTD: '',
        // GET FROM INPUT LOKASI USER
        ORIGIN: '',
        // GET FROM OUTLET ADDRESS
        DESTINATION: '',
        // GET FROM OUTLET ID
        OUTLETID: '',
        // GET FROM USER SERVICE (THIS CURRENT LOGGED IN USER)
        USERID: '',
        NOTES: ''
      },
      // AUTO SET, AFTER CHECKOUT SET FIRST PROGRESS TO TRUE
      PROGRESS:  [
        {
          NAME: 'Order placed & confirmed',
          STATUS: true
        },
        {
          NAME: 'Driver on the way to pickup',
          STATUS: false
        },
        {
          NAME: 'Laundry picked up, delivering to outlet',
          STATUS: false
        },
        {
          NAME: 'Laundry received & confirmed by outlet',
          STATUS: false
        },
        {
          NAME: 'Laundry is being washed',
          STATUS: false
        },
        {
          NAME: 'Laundry is finished washing',
          STATUS: false
        },
        {
          NAME: 'Laundry is on the way!',
          STATUS: false
        },
        {
          NAME: 'Laundry has been received',
          STATUS: false
        }
      ]
  }});
  orderDataStreams = this.orderDataSource.asObservable();

  constructor(
      private router: Router,
      private db: AngularFireDatabase
  ) {
    this.ordersRef = db.list(this.dbPath);
  }

  setOrderData(newData) {
    this.orderDataStreams = newData;
    this.orderDataSource.next(newData);
    console.log('===AFTER SET this.orderDataStreams', this.orderDataStreams);
    console.log('===AFTER SET this.orderDataSource', this.orderDataSource);
  }

  getOrderData() {
    return this.orderDataSource.asObservable();
  }

  getOngoingOrder(user: any): Promise<any>{
    /* Disini harusnya nerima user id dari tab1.page.ts
    * cuman ntah kenapa hasilnya tuh evaluated pas runtime jad undefined pas dikirim
    * kalau di console log 'Value Evaluated Just Now' messagenya
    * belum tau gimana cara dapetin langsung objectnya, kalo baca-baca sih katanya
    * harus pake subscribe tp belom cek
    * nanti harusnya jadi
    * this.db
    * .database.ref('orders/' + user.id) ........
    * */
    // console.log('===user', user);
    return this.db.database.ref('orders/ONuPibfPl1aHoQRF0RDb2h7XOPS2')
        .once('value').then((dataSnapshot) => {
          return dataSnapshot.val();
        });
  }

  addToDb(orderDetail) {
    const { id: userId } = orderDetail;
    this.dbRef = this.db.database.ref().child('orders');
    this.dbRef.child(`${userId}`).push({...orderDetail});
  }
}
