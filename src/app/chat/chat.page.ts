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
export class ChatPage implements OnInit, AfterViewChecked {
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
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('idOrder')) {
        return;
      }

      this.auth.onAuthStateChanged((user) => {
        this.uid = user.uid;
      }).then(() => {
        this.orderId = paramMap.get('idOrder');
        console.log("ord", this.orderId)
        let orderId = this.orderId;
        console.log('/orders/' + this.uid + "/" + this.orderId)
        this.db.object('/orders/' + this.uid + "/" + this.orderId).valueChanges().subscribe((data: any) => {
          this.idOutlet = data.DETAIL.OUTLETID;
        })

        this.db.list('/chat/').query.orderByKey().equalTo(this.orderId).once('value').then(
          (data: any) => {
            if (data.val()) {
              this.fetchingChat()
            } else {
              this.db.database.ref().child('chat/').child(`${orderId}`).set({
                id_outlet: this.idOutlet,
                user: this.uid,
                outlet_name: this.outletName,
                chat: {}
              }).then(
                () => {
                  console.log("berhasill")
                  this.fetchingChat()
                }).catch((err) => console.log("error", err))
            }
          }
        )
      })
    })
  }

  fetchingChat() {
    this.db.object('/chat/' + this.orderId).valueChanges().subscribe((data: any) => {
      this.uid = data.user;
      this.outletName = data.outlet;
      Object.keys(data.chat).forEach(chatKey => {
        this.loadedChat.push({
          message: data.chat[chatKey].message,
          time: data.chat[chatKey].time,
          sender: data.chat[chatKey].sender
        });
      });
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
    this.chatContainers.changes.subscribe((list: QueryList<ElementRef>) => {
      this.scrollToBottom();
    })
  }

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
