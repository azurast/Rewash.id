import {Component, OnInit} from '@angular/core';
import { UserService } from '../services/users/user.service';
import {User} from '../services/users/user';
import {OrderService} from '../services/order/order.service';
import { NavController } from '@ionic/angular';
import {Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  user: User;
  allOrders: any;

  constructor(
      private userService: UserService,
      private orderService: OrderService,
      private navController: NavController,
      private router: Router
  ) {}

  toDate(isoString: string) {
    const date  = new Date(isoString);
    return date.toDateString() + ' ' + date.toTimeString().substring(0,5);
  }

  ngOnInit() {
    this.user = this.userService.getLoggedInUser();
    this.orderService.getOngoingOrder(this.user)
        .then((res) => {
          this.allOrders = res;
          // console.log('===this.allOrders', this.allOrders);
          // User id baru kebaca disini, berarti manggil order service harus nunggu user
          // service selesai jalan dulu & return hasil yg bener
          // console.log('===this.user', this.user.id);
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
