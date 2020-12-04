import { Component, OnInit } from '@angular/core';
import { IonPullUpFooterState } from 'ionic-pullup';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-input-items',
  templateUrl: './input-items.page.html',
  styleUrls: ['./input-items.page.scss'],
})
export class InputItemsPage implements OnInit {

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
