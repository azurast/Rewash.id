import {AfterViewChecked, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
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
  @ViewChild('scrollChat') private myScrollContainer: ElementRef;
  @ViewChildren('chatContainer') chatContainers: QueryList<ElementRef>;
  outletName: string;
  loadedChat: Chat[] = [];
  uid: string;
  orderId: string;
  message = '';
  idOutlet: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private db: AngularFireDatabase,
    public auth: AngularFireAuth,
  ) {
  }

  ngOnInit() {
    let uid: string;
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('idOrder')) {
        return;
      }

      this.orderId = paramMap.get('idOrder');

      this.auth.onAuthStateChanged((user) => {
        uid = user.uid;
        this.uid = user.uid
      }).then(() => {
        this.db.list('/chat/').query.orderByKey().equalTo(this.orderId).once('value').then(
          (data: any) => {
            let orderId: string;
            let outletName: string;
            let outletId: string;

            if (data.val()) {
              orderId = paramMap.get('idOrder');
              this.fetchingChat()
            } else {
              orderId = paramMap.get('idOrder');
              this.db.object('/orders/' + uid + "/" + orderId).valueChanges().subscribe((data: any) => {
                outletId = data.DETAIL.SHIPPING.OUTLETID;
                outletName = data.DETAIL.SHIPPING.DESTINATION

                this.db.database.ref().child('chat/').child(`${orderId}`).set({
                  id_outlet: outletId,
                  user: uid,
                  outlet_name: outletName,
                  chat: {
                    "-AA": {
                      "sender": outletId,
                      "time": new Date().getHours() + ":" + new Date().getMinutes(),
                      "message": "Thank you for using Rewash.id. Please wait our outlet to confirmation your order."
                    }
                  }
                }).then(
                  () => {
                    this.fetchingChat()
                    this.outletName = outletName
                  }
                )
              })
            }
          }
        )
      })
    })
  }

  fetchingChat() {
    this.db.object('/chat/' + this.orderId).valueChanges().subscribe((data: any) => {
      this.loadedChat = [];
      this.uid = data.user;
      this.outletName = data.outlet_name;
      Object.keys(data.chat).forEach(chatKey => {
        this.loadedChat.push({
          message: data.chat[chatKey].message,
          time: data.chat[chatKey].time,
          sender: data.chat[chatKey].sender
        });
      });
    });
  }

  // ngAfterViewChecked() {
  //   this.scrollToBottom();
  //   this.chatContainers.changes.subscribe((list: QueryList<ElementRef>) => {
  //     this.scrollToBottom();
  //   })
  // }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {
    }
  }

  handleSendMessage() {
    if (this.message !== '') {
      this.db.list('/chat/' + this.orderId + '/chat').push({
        sender: this.uid,
        time: new Date().getHours() + ':' + new Date().getMinutes(),
        message: this.message
      });
      this.message = '';
      this.loadedChat = [];
    }
  }

}
