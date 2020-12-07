import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private dbPath = '/users';
  usersRef: AngularFireList<User> = null;
  dbRef: any;
  loggedInUser: User;
  private currentUser: string;

  constructor(private db: AngularFireDatabase) {
    this.usersRef = db.list(this.dbPath);
  }

  avatar = [
    "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/1.png",
    "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/female/1.png",
    "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/2.png",
    "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/female/2.png",
    "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/3.png",
    "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/female/3.png",
    "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/4.png",
    "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/female/4.png",
    "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/5.png",
    "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/female/5.png",
    "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/6.png",
    "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/female/6.png",
    "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/7.png",
    "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/female/7.png",
    "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/8.png",
    "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/female/8.png",
    "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/9.png",
    "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/female/9.png",
    "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/10.png",
    "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/female/10.png",
    "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/11.png",
    "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/female/11.png",
    "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/12.png",
    "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/female/12.png",
    "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/13.png",
    "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/female/13.png",
    "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/14.png",
    "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/female/14.png",
    "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/15.png",
    "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/female/15.png",
  ]

  /* After user sign up, create new reference to that user in DB */
  create(user: any, fullName: string, phoneNumber: string): any {
    const { uid , providerData } = user;
    this.dbRef = this.db.database.ref().child('users');
    this.dbRef.child(`${uid}`).set({
      email: providerData[0].email,
      fullName,
      phoneNumber,
      imageUrl: '',
      address: []
    });
  }

  /* After Logging In, Save User Information */
  setLoggedInUser(uid: string, email: string) {
    this.loggedInUser = new User();
    this.dbRef = this.db.database.ref('users/' + uid).once('value').then((dataSnapshot) => {
      this.loggedInUser.id = uid;
      this.loggedInUser.name = dataSnapshot.val().fullName || '';
      this.loggedInUser.email = dataSnapshot.val().email || email;
      this.loggedInUser.phoneNumber = dataSnapshot.val().phoneNumber;
      this.loggedInUser.address = dataSnapshot.val().address || [];
      this.loggedInUser.imageUrl = dataSnapshot.val().imageUrl || [];
    });
  }

  /* Returns the currently signed in user */
  getLoggedInUser() {
    return this.loggedInUser;
  }

  storeLoggedUser(uid: string) {
    this.currentUser = uid;
  }

  getLoggedUser() {
    return this.currentUser;
  }

  fetchAvatar() {
    return this.avatar;
  }
}
