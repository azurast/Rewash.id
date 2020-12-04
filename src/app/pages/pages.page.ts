import { Component, OnInit } from '@angular/core';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {Router} from '@angular/router';
import {Platform} from '@ionic/angular';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {timer} from 'rxjs';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.page.html',
  styleUrls: ['./pages.page.scss'],
})
export class PagesPage implements OnInit {
  slideOpts = {
    initialSlide: 1,
    speed: 400
  };

  showSplash = true;
  constructor(public platform: Platform, private splashScreen: SplashScreen,
              private router: Router, private statusBar: StatusBar) { }

  ngOnInit() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      timer(3000).subscribe(() => this.showSplash = false );
    });
  }

  toLogin(){
    this.router.navigate(['/authentication']);
  }
}
