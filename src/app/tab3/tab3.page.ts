import {Component, OnInit} from '@angular/core';
import { UserService } from '../services/users/user.service';
import { User} from '../services/users/user';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  user: User;
  constructor(
    public auth: AngularFireAuth,
    private router: Router,
    private userService: UserService
  ) {}
  ngOnInit(): void {
    this.user = this.userService.getLoggedInUser();
  }

  signOut() {
    return this.auth.signOut().then(() => {
      this.router.navigateByUrl('/authentication');
    })
  }
}
