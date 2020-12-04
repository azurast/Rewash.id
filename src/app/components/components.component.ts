import { Component, OnInit } from '@angular/core';
import localeId from '@angular/common/locales/id';
import {registerLocaleData} from '@angular/common';
registerLocaleData(localeId, 'id');

@Component({
  selector: 'app-components',
  templateUrl: './components.component.html',
  styleUrls: ['./components.component.scss'],
})
export class ComponentsComponent implements OnInit {

  items = { NAME: [], PRICE: [] };
  constructor() { }

  ngOnInit() {

  }
  button(){}

}
