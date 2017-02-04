import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Tabs } from 'ionic-angular';
import { AuthService } from "../../providers/auth-service";
import * as moment from "moment";
import { GlobalVarsService } from "../../providers/global-vars-service";
import { MeetingService } from "../../providers/meeting-service";
import { FirebaseChatService } from "../../providers/firebase-chat-service";
import { ChatDetailsPage } from "../chat-details/chat-details";
import { FindUserPage } from "../find-user/find-user";
import { AngularFireDatabase, FirebaseListObservable } from "angularfire2";
import { Observable } from "rxjs/Observable";


@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html'
})
export class ChatPage {

  private chats: FirebaseListObservable<any[]>;
  private myId: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private authService: AuthService,
    private chatService: FirebaseChatService,
    private db: AngularFireDatabase,
    private meetingService: MeetingService,
    private globalVars: GlobalVarsService,
    private alertCtrl: AlertController) {

    this.myId = this.globalVars.getValue("userData").id;
    this.getChatList();

  }

  selectChat(chat: any) {
    event.stopPropagation();
    event.preventDefault();

    let tabs: Tabs = this.navCtrl.parent;
    let chatDetails: any = tabs.parent.getViews().find(itm => itm.name === "ChatDetailsPage") || ChatDetailsPage;

    tabs.parent.push(chatDetails, {
      sender: this.globalVars.getValue("userData"),
      receiver: chat,
      chatId: chat.chatId
    }, { animate: true });

  }

  findUser() {
    event.stopPropagation();
    event.preventDefault();
    let findUser = this.navCtrl.getViews().find(itm => itm.name === "FindUserPage ") || FindUserPage;
    this.navCtrl.push(findUser, null, { animate: true });
  }

  /**
   * Get chat list
   */
  getChatList() {
    this.chats = this.db.list("users/" + this.myId + "/chatsWith", {
      query: { orderByChild: "timeStamp" }
    }).map((array) => array.reverse()) as FirebaseListObservable<any[]>;

  }

  ionViewWillEnter() {
    this.getChatList();
  }

  ionViewWillLeave() {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
  }

  alertUser(title: string, message: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  /**
   * Date Format Helper
   */
  getDateFormated(value: Date): string {
    return moment(value).fromNow();
  }


}
