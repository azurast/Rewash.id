import {Component, HostListener, OnInit} from '@angular/core';
import { ALL_ITEMS } from '../../../constants/items-pricing';
import { Item } from '../../../constants/item-model';
import { CurrencyPipe } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeId from '@angular/common/locales/id';
import { element } from 'protractor';
import { FormControl, FormGroup, Validators } from '@angular/forms';
registerLocaleData(localeId, 'id');
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { OrderService } from '../../services/order/order.service';

@Component({
  selector: 'app-input-dropdown',
  templateUrl: './input-dropdown.component.html',
  styleUrls: ['./input-dropdown.component.scss'],
})
export class InputDropdownComponent implements OnInit {
  normalItems: Array<Item> = [];
  specialItems: Array<Item> = [];
  otherItems: Array<any> = [];
  cart: Array<Item> = [];
  isGeneralMenuHidden: boolean;
  isSpecialMenuHidden: boolean;
  isOthersMenuHidden: boolean;
  addOtherItemForm: FormGroup;
  count: number;
  hasAlertBeenShown: boolean;

  constructor(
      public toastController: ToastController,
      public alertController: AlertController,
      public orderService: OrderService
  ) {
  }

  ngOnInit() {
    this.count = 0;
    this.hasAlertBeenShown = false;
    this.normalItems = ALL_ITEMS.NORMAL_ITEMS;
    this.specialItems = ALL_ITEMS.SPECIAL_ITEMS;
    this.addOtherItemForm = new FormGroup({
      other_item_name: new FormControl(null, {
        updateOn: 'blur',
        validators: Validators.required
      }),
      other_item_qty: new FormControl(null, {
        updateOn: 'blur',
        validators: Validators.required
      })
    });
  }

  onRemoveNormalItem(key: any) {
    this.normalItems.forEach((obj: Item) => {
      if (obj.QTY > 0 && obj.KEY === key) {
        --obj.QTY;
      }
    });
  }

  onAddNormalItem(key: any) {
    this.normalItems.forEach((obj: Item) => {
      if (obj.KEY === key) {
        ++obj.QTY;
      }
    });
  }

  onRemoveSpecialItem(key: any) {
    this.specialItems.forEach((obj: Item) => {
      if (obj.QTY > 0 && obj.KEY === key) {
        --obj.QTY;
      }
    });
  }

  onAddSpecialItem(key: any) {
    this.specialItems.forEach((obj: Item) => {
      if (obj.KEY === key) {
        ++obj.QTY;
      }
    });
  }

  onRemoveOtherItem(key: any) {
    this.otherItems.forEach((obj: Item) => {
      if (obj.QTY > 0 && obj.KEY === key) {
        --obj.QTY;
      }
    });
  }

  // ITEMS ADDED TO CART
  calculateCart() {
    const specialItemsRes = this.specialItems.filter(item => item.QTY > 0);
    const normalItemsRes = this.normalItems.filter(item => item.QTY > 0);
    const otherItemsRes = this.otherItems;

    let specialItemsPriceTotal = 0;
    let normalItemsPriceTotal = 0;
    let otherItemsPriceTotal = 0;
    let totalOrderPrice = 0;
    let normalItemsEstWeightTotal = 0;
    let specialItemsEstWeightTotal = 0;
    let otherItemsEstWeightTotal = 0;

    specialItemsRes.forEach((item) => {
      specialItemsPriceTotal += (item.PRICE * item.QTY);
      specialItemsEstWeightTotal += (item.WEIGHT * item.QTY);
    });
    normalItemsRes.forEach((item) => {
      normalItemsEstWeightTotal += (item.WEIGHT * item.QTY);
    });
    otherItemsRes.forEach((item) => {
      otherItemsPriceTotal += (25000 * item.QTY);
      otherItemsEstWeightTotal += (200 * item.QTY);
    });

    normalItemsPriceTotal = 10000 * (normalItemsEstWeightTotal / 1000);
    totalOrderPrice = specialItemsPriceTotal + normalItemsPriceTotal + otherItemsPriceTotal;

    const cart = {
      SPECIAL : [...specialItemsRes],
      NORMAL: [...normalItemsRes],
      OTHERS: [...otherItemsRes],
      DETAIL: {
        PRICE : [
          {
            NAME: 'Special Items Price',
            PRICE: specialItemsPriceTotal,
          },
          {
            NAME: 'Normal Items Price',
            PRICE: normalItemsPriceTotal,
          },
          {
            NAME: 'Other Items Price',
            PRICE: otherItemsPriceTotal,
          },
          {
            NAME: 'Total Order Price',
            PRICE: totalOrderPrice,
          }
        ],
        WEIGHT: {
          normalItemsEstWeightTotal: Math.ceil(normalItemsEstWeightTotal / 1000),
          specialItemsEstWeightTotal: Math.ceil(specialItemsEstWeightTotal / 1000)
        }
      }
    };
    this.orderService.setOrderData(cart);
  }

  onAddOtherItem(key: any) {
    this.otherItems.forEach((obj: Item) => {
      if (obj.KEY === key) {
        ++obj.QTY;
      }
    });
  }

  // DELETE ITEM ALERT
  async deleteOtherItem(itemKeyToDelete: string) {
    const alert = await this.alertController.create({
      header: 'Delete this item?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            alert.dismiss();
          }
        }, {
          text: 'Yes',
          handler: () => {
            this.otherItems = this.otherItems.filter((item) => item.KEY !== itemKeyToDelete);
          }
        }
      ]
    });
    await alert.present();
  }

  // TOGGLE GENERAL MENU
  toggleGeneralMenu() {
    this.isGeneralMenuHidden = !this.isGeneralMenuHidden;
  }

  // TOGGLE SPECIAL MENU
  toggleSpecialMenu() {
    this.isSpecialMenuHidden = !this.isSpecialMenuHidden;
  }

  // TOGGLE OTHERS MENU
  toggleOthersMenu() {
    if (!this.hasAlertBeenShown) {
      this.presentAlert();
    }
    this.isOthersMenuHidden = !this.isOthersMenuHidden;
  }

  /*
    HASH KEY FOR OTHER ITEM
    IF USER INPUT OTHER ITEM NAME THAT ARE THE SAME,
    MUST ENSURE KEY IS DIFFERENT
    THIS HAS KEY USES NAME & COUNT VAR
  */
  hashCode = (s) => s.split('').reduce((a, b) => {
    // tslint:disable-next-line:no-bitwise
    a = (( a << 5 ) - a ) + b.charCodeAt(0);
    // tslint:disable-next-line:no-bitwise
    return a & a + Math.random();
  }, 0)

  // OTHER ITEM
  addOtherItem(newItem) {
    const { other_item_name, other_item_qty } = newItem;
    this.count++;
    if (other_item_name !== null || other_item_qty !== null) {
      this.otherItems.push({
        KEY: Math.abs(this.hashCode(newItem.other_item_name + this.count)).toString(),
        NAME: other_item_name,
        QTY: other_item_qty
      });
      this.addOtherItemForm.reset();
      this.presentToast('Item has been added!', 'success');
    } else {
      this.presentToast('Input can\'t be empty!', 'danger');
    }
  }

  // DYNAMIC TOAST
  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color
    });
    toast.present();
  }

  // STORE ALERT
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Store Policy',
      message: '*Please make sure you have already checked that the item you will input isn\'t already listed on categories above.\n Also please note you will be charged according to our store policy.',
      buttons: ['OK']
    });
    await alert.present().then(() => {
      this.hasAlertBeenShown = true;
    });
  }
}
