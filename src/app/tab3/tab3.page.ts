import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/users/user.service';
import { User} from '../services/users/user';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BooleanValueAccessor } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  user: User;
  loading: boolean;

  photo: string;
  constructor(
    public auth: AngularFireAuth,
    private router: Router,
    private userService: UserService
  ) {}
  ngOnInit(): void {
    this.user = this.userService.getLoggedInUser();
    if (!this.user.imageUrl) {
      this.photo = 'https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/8.png'
    } else {
      this.photo = this.user.imageUrl;
    }
  }

  signOut() {
    this.loading = true;
    return this.auth.signOut().then(() => {
      this.userService.remove()
      this.router.navigateByUrl('/authentication');
    });
  }

  ionViewWillEnter() {
    console.log("masuk3")
    this.user = this.userService.getLoggedInUser();
  }
}
