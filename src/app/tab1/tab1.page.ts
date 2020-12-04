import {Component, OnInit} from '@angular/core';
import {UserService} from "../services/users/user.service";
import {Order} from "../services/order/order.model";
import {AngularFireDatabase} from "@angular/fire/database";
import {OrderService} from "../services/order/order.service";
import {Router} from "@angular/router";
import {AngularFireAuth} from "@angular/fire/auth";
import {map} from "rxjs/operators";
import { User } from '../services/users/user';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page implements OnInit {
  user: User;
  uid: string;
  ongoingOrders: any = [];

  constructor(
    private userService: UserService,
    private orderService: OrderService,
    private db: AngularFireDatabase,
    public auth: AngularFireAuth,
    private router: Router
  ) {
  }

  fetchOngoingOrder() {
    this.db.list<Order>('/orders/' + this.uid).snapshotChanges().pipe(
      map(changes => changes.map(data => ({
        id: data.payload.key,
        ...data.payload.val()
      })))
    ).subscribe( data => {
      console.log(data)
      this.ongoingOrders = data.filter( val => {
        return val.orderStatus !== "finished";
      })
    })
    console.log(this.ongoingOrders)
  }

  ngOnInit() {
    this.user = this.userService.getLoggedInUser();
    this.auth.onAuthStateChanged((user) => {
      if (!user) {
        this.router.navigateByUrl('/authentication')
      }
      else {
        this.uid = user.uid;
        this.fetchOngoingOrder();
        this.userService.storeLoggedUser(user.uid);
      }
    });
  }

  ionViewWillEnter() {
    //this.ongoingOrders = this.orderService.getAllOrder();
  }

}
