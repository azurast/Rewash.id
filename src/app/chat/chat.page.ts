import {Component, OnInit} from '@angular/core';
import {Chat} from '../services/chat/chat.model';
import {ActivatedRoute} from '@angular/router';
import {AngularFireDatabase} from '@angular/fire/database';
import {AngularFireAuth} from '@angular/fire/auth';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  outletName: string;
  loadedChat: Chat[] = [];
  uid: string;
  orderId: string;
  message = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private db: AngularFireDatabase,
    public auth: AngularFireAuth,
  ) {
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('idOrder')) {
        return;
      }

      this.orderId = paramMap.get('idOrder');

      this.db.object('/chat/' + this.orderId).valueChanges().subscribe(data => {
        // @ts-ignore
        this.uid = data.user;
        // @ts-ignore
        this.outletName = data.outlet_name;
        // @ts-ignore
        Object.keys(data.chat).forEach(chatKey => {
          // @ts-ignore
          this.loadedChat.push({
            // @ts-ignore
            message: data.chat[chatKey].message,
            // @ts-ignore
            time: data.chat[chatKey].time,
            // @ts-ignore
            sender: data.chat[chatKey].sender
          });
        });
      });
    });
  }

  handleSendMessage() {
    if (this.message !== '') {
      this.db.list('/chat/' + this.orderId + '/chat').push({
        sender: this.uid,
        time: new Date().getHours() + ':' + new Date().getMinutes(),
        message: this.message
      });
      this.message = '';
    }
  }

}
