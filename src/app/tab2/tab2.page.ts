import {Component, OnInit} from '@angular/core';
import { UserService } from '../services/users/user.service';
import {User} from '../services/users/user';
import {OrderService} from '../services/order/order.service';
import { NavController } from '@ionic/angular';
import {Router, NavigationExtras } from '@angular/router';
import {AngularFireDatabase} from "@angular/fire/database";
import {AngularFireAuth} from "@angular/fire/auth";
import {Order} from "../services/order/order.model";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  user: User;
  uid: string;
  allOrders: any = [];

  constructor(
      private userService: UserService,
      private orderService: OrderService,
      private navController: NavController,
      private db: AngularFireDatabase,
      public auth: AngularFireAuth,
      private router: Router
  ) {}

  toDate(isoString: string) {
    const date  = new Date(isoString);
    return date.toDateString() + ' ' + date.toTimeString().substring(0,5);
  }

  fetchAllOrder() {
    this.db.list<Order>('/orders/' + this.uid).snapshotChanges().pipe(
      map(changes => changes.map(data => ({
        id: data.payload.key,
        ...data.payload.val()
      })))
    ).subscribe( data => {
      console.log(data)
      this.allOrders = data;
    })
    console.log(this.allOrders)
  }

  ngOnInit() {
    this.user = this.userService.getLoggedInUser();
    this.auth.onAuthStateChanged((user) => {
      if (!user) {
        this.router.navigateByUrl('/authentication')
      }
      else {
        this.uid = user.uid;
        this.fetchAllOrder();
        this.userService.storeLoggedUser(user.uid);
      }
    });
  }

  goToOrderDetail(orderObject: any) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        data: JSON.stringify(orderObject)
      },
      skipLocationChange: true
    };
    this.router.navigate(['order-detail'],  navigationExtras);
  }
}
