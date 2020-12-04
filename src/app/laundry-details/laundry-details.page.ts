import { Component, OnInit } from '@angular/core';
import { IonPullUpFooterState } from 'ionic-pullup';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-laundry-details',
  templateUrl: './laundry-details.page.html',
  styleUrls: ['./laundry-details.page.scss'],
})
export class LaundryDetailsPage implements OnInit {

  footerState: IonPullUpFooterState;
  white: string;

  constructor(public navCtrl: NavController) {
    this.footerState = IonPullUpFooterState.Collapsed;
  }

  ngOnInit() {
    this.white = '#FFFFFF';
  }

  footerExpanded() {
    console.log('Footer expanded!');
  }

  footerCollapsed() {
    console.log('Footer collapsed!');
  }

  toggleFooter() {
    this.footerState = this.footerState === IonPullUpFooterState.Collapsed ? IonPullUpFooterState.Expanded : IonPullUpFooterState.Collapsed;
  }

}
