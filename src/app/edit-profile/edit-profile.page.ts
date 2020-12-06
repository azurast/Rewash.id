import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/users/user.service';
import { User} from '../services/users/user';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
