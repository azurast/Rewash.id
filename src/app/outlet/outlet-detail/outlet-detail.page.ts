import {Component, OnInit} from '@angular/core';
import {Outlet} from '../../services/outlets/outlet.model';
import {ActivatedRoute} from '@angular/router';
import {OutletService} from '../../services/outlets/outlet.service';

@Component({
  selector: 'app-outlet-detail',
  templateUrl: './outlet-detail.page.html',
  styleUrls: ['./outlet-detail.page.scss'],
})

export class OutletDetailPage implements OnInit {
  outlet: Outlet[] = [];
  loadedOutlet: Outlet;
  fullStar: number;
  halfStar = false;
  emptyStar = 5;
  rating: number;
  openHours: string[] = [];
  day: string[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  UIday: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  reviews: any;

  constructor(
      private activatedRoute: ActivatedRoute,
      private outletService: OutletService
  ) {
  }

  renderOpenHours() {
    this.day.forEach(singleDay => {
      if (this.loadedOutlet.openHours[singleDay]) {
        this.openHours.push(this.loadedOutlet.openHours[singleDay].open + ' - ' +
            this.loadedOutlet.openHours[singleDay].close);
      } else {
        this.openHours.push('CLOSED');
      }
    });
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('outletId')) {
        return;
      }
      const outletId = paramMap.get('outletId');
      this.loadedOutlet = this.outletService.getOutlet(outletId);
      console.log('===loadedOutlet', this.loadedOutlet);
      this.reviews = this.loadedOutlet.feedbacks;
      // console.log('===this.reviews', this.reviews);
      this.rating = this.loadedOutlet.points / this.loadedOutlet.transactions;
      this.fullStar = Math.floor(this.rating);
      if (this.rating % 1 !== 0) {
        this.halfStar = true;
        this.emptyStar = this.emptyStar - this.fullStar - 1;
      } else {
        this.emptyStar = this.emptyStar - this.fullStar;
      }
      this.renderOpenHours();
    });
  }

}
