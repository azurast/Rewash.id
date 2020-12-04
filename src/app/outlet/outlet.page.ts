import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Outlet } from '../services/outlets/outlet.model';
import { OutletService } from '../services/outlets/outlet.service';

@Component({
  selector: 'app-outlet',
  templateUrl: './outlet.page.html',
  styleUrls: ['./outlet.page.scss'],
})
export class OutletPage implements OnInit {
  outlet: Outlet[] = [];
  dummyLatitude = -6.255085;
  dummyLongitude = 106.615671;

  constructor(
    private outletService: OutletService,
    private db: AngularFireDatabase
  ) {
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
                distance: this.getDistance(this.dummyLatitude, this.dummyLongitude,
                  data.val()[outletKey].latitude, data.val()[outletKey].longitude
                )
              });
            });
      });
  }

  ngOnInit() {
    this.fetchOutletFromDatabase();
    // setTimeout(() => this.outlet.sort((a, b) => (a.distance > b.distance) ? 1 : -1), 2000);
    console.log(this.outlet);
    this.outlet.sort((a, b) => (a.distance > b.distance) ? 1 : -1);
    this.outletService.storeOutlet(this.outlet);
  }

  ionViewWillEnter() {
    // this.outlet = this.outletService.getAllOutlets();
  }


}
