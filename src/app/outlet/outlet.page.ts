import {Component, OnInit, ViewChild} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {Outlet} from '../services/outlets/outlet.model';
import {OutletService} from '../services/outlets/outlet.service';
import {GooglePlaceDirective} from "ngx-google-places-autocomplete";
import {Address} from "ngx-google-places-autocomplete/objects/address";
import {OrderService} from "../services/order/order.service";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-outlet',
  templateUrl: './outlet.page.html',
  styleUrls: ['./outlet.page.scss'],
})
export class OutletPage implements OnInit {
  @ViewChild("placesRef") placesRef: GooglePlaceDirective;
  outlet: Outlet[] = [];
  inputLatitude = 0;
  inputLongitude = 0;
  inputLocation: string = "";
  options = {
    componentRestriction: {
      country: ['ID']
    }
  }

  constructor(
    private outletService: OutletService,
    private orderService: OrderService,
    private db: AngularFireDatabase,
    private http: HttpClient
  ) {
  }

  public handleAddressChange(address: Address) {
    this.inputLatitude = address.geometry.location.lat();
    this.inputLongitude = address.geometry.location.lng();
    this.inputLocation = address.formatted_address;
    console.log(address)

    this.fetchOutletFromDatabase();
    setTimeout(() => this.outlet.sort((a, b) => (a.distance > b.distance) ? 1 : -1), 2000);
    this.outletService.storeOutlet(this.outlet);
  }

  getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  fetchOutletFromDatabase() {
    this.outlet = [];
    this.db.object('/outlet').query.once('value')
      .then(data => {
        Object.keys(data.val()).forEach(outletKey => {
          this.outlet.push({
            id: outletKey,
            feedbacks: data.val()[outletKey].feedbacks || [],
            name: data.val()[outletKey].name,
            location: data.val()[outletKey].location,
            longitude: data.val()[outletKey].longitude,
            latitude: data.val()[outletKey].latitude,
            openHours: data.val()[outletKey].open_hours,
            rate: data.val()[outletKey].rate,
            transactions: data.val()[outletKey].transactions,
            points: data.val()[outletKey].points,
            admin: data.val()[outletKey].admin,
            distance: this.getDistance(this.inputLatitude, this.inputLongitude,
              data.val()[outletKey].latitude, data.val()[outletKey].longitude
            )
          });
        });
      });
  }

  ngOnInit() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: Position) => {
        this.inputLatitude = position.coords.latitude
        this.inputLongitude = position.coords.longitude

        let url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + this.inputLatitude + "," + this.inputLongitude +"&key=AIzaSyDehuZ6WNyD6N-U9FT3R7ckDTQdQgK4JCE"
        this.http.get(url).subscribe(
          (data: any) => {
            this.inputLocation = data.results[0].formatted_address;
          })
      })
    }
    this.fetchOutletFromDatabase();
    setTimeout(() => this.outlet.sort((a, b) => (a.distance > b.distance) ? 1 : -1), 2000);
    this.outletService.storeOutlet(this.outlet);
  }

  ionViewWillEnter() {
    this.orderService.clearOrderDetail();
  }

  handleSelectOutlet(id: string) {
    this.orderService.storeOrderDetail(id)
    this.orderService.storeOrderDetail(this.inputLatitude)
    this.orderService.storeOrderDetail(this.inputLongitude)
    this.orderService.storeOrderDetail(this.inputLocation)
  }
}
