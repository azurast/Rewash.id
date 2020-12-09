import {Component, OnInit} from '@angular/core';
import {UserService} from '../services/users/user.service';
import {User} from '../services/users/user';
import {NgForm} from "@angular/forms";
import {AngularFireDatabase} from "@angular/fire/database";
import {Router} from "@angular/router";

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  require: any
  user: User;
  profilePic: string;
  isEditingPic: boolean = false;
  avatar: string[] = [];
  showAvatar: string[] = [];
  pagePosition: number = 1;

  constructor(
    private db: AngularFireDatabase,
    private userService: UserService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.user = this.userService.getLoggedInUser();
    if (this.user.imageUrl) {
      this.profilePic = this.user.imageUrl;
    } else {
      this.profilePic = "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/8.png"
    }
    this.avatar = this.userService.fetchAvatar();
    this.fetchShowAvatar(1, 2, 3, 4)
  }

  ionViewWillEnter() {
    this.pagePosition = 1;
    this.user = this.userService.getLoggedInUser();
    this.profilePic = this.user.imageUrl;
    this.avatar = this.userService.fetchAvatar();
    this.fetchShowAvatar(1, 2, 3, 4)
  }

  fetchShowAvatar(a, b, c, d) {
    this.showAvatar = []
    this.showAvatar.push(
      this.avatar[a],
      this.avatar[b],
      this.avatar[c],
      this.avatar[d]
    )
  }

  handleStartEditing() {
    this.isEditingPic = true;
  }

  handleChooseAvatar(ava: string) {
    this.profilePic = ava;
    this.isEditingPic = false;
  }

  handleCancelEditing() {
    this.isEditingPic = false;
  }

  handleChangePage(number: number) {
    this.pagePosition = this.pagePosition + number

    switch (this.pagePosition) {
      case 1:
        this.fetchShowAvatar(1, 2, 3, 4)
        break
      case 2:
        this.fetchShowAvatar(5, 6, 7, 8)
        break
      case 3:
        this.fetchShowAvatar(8, 10, 11, 12)
        break
      case 4:
        this.fetchShowAvatar(13, 14, 15, 16)
        break
      case 5:
        this.fetchShowAvatar(17, 18, 19, 20)
        break
      case 6:
        this.fetchShowAvatar(21, 22, 23, 24)
        break
      case 7:
        this.fetchShowAvatar(25, 26, 27, 28)
        break
      default:
        this.fetchShowAvatar(1, 2, 3, 4)
    }
  }

  saveProfile(form: NgForm) {
    console.log(form.value)
    let name = form.value.name
    let phone = form.value.phone
    let userID = this.user.id

    // console.log(name)

    this.db.list('users').update(userID, {
      fullName: name,
      phoneNumber: phone,
      imageUrl: this.profilePic
    }).then(() => {
      this.userService.setLoggedInUser(userID);
      setTimeout(() => {
        this.router.navigateByUrl('/tabs/tab3');
        }, 3000
      )
    })
  }
}
