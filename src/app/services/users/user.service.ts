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
}
