import {Injectable} from '@angular/core';
import {Outlet} from './outlet.model';

@Injectable({
  providedIn: 'root'
})
export class OutletService {
  public outlets: Outlet[] = [];

  constructor() {
  }

  storeOutlet(outlets: Outlet[]) {
    this.outlets = [];
    this.outlets = outlets;
  }

  getAllOutlets() {
    return [...this.outlets];
  }

  getOutlet(outletId: string) {
    return {
      ...this.outlets.find(outlet => {
        return outlet.id === outletId;
      })
    };
  }
}
