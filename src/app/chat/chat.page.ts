import {Component, ElementRef, OnInit, ViewChild, AfterViewChecked, QueryList, ViewChildren} from '@angular/core';
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

      this.db.object('/chat/' + this.orderId).valueChanges().subscribe((data: any) => {
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
    });
    this.scrollToBottom();
    // this.chatContainers.changes.subscribe((list: QueryList<ElementRef>) => {
    //   this.scrollToBottom();
    // })
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
    } catch(err) {
      console.log(err)
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
