import { Component, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NavController, NavParams, Content } from 'ionic-angular';
import * as moment from "moment";
import { UserProfilePage } from "../user-profile/user-profile";
import { GlobalVarsService } from "../../providers/global-vars-service";
import { AngularFireDatabase, FirebaseListObservable } from "angularfire2";
import { FirebaseChatService } from "../../providers/firebase-chat-service";

@Component({
  selector: 'page-chat-details',
  templateUrl: 'chat-details.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatDetailsPage {


  @ViewChild("myContent")
  private content: Content;

  private receiver: any;
  private sender: any;

  private inputRow: number = 4;
  private myAvatar: string;
  private myId: string;

  private chatId: string;

  private messages: FirebaseListObservable<any[]>;
  private messageToSend: string = "";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private chatService: FirebaseChatService,
    private db: AngularFireDatabase,
    private globalVars: GlobalVarsService) {

    this.receiver = navParams.get("receiver");
    this.sender = navParams.get("sender");

    // dummy
    this.receiver.id = this.sender.id === "38923443" ? "356437903" : "38923443";

    this.myAvatar = this.sender.avatar;
    this.myId = this.sender.id;

    this.chatId = this.navParams.get("chatId");
    if (this.chatId !== undefined) {
      this.messages = this.db.list("messages/" + this.chatId);
      this.messages.subscribe(data => {
        // scroll to the bottom
        this.content.scrollToBottom(250);
      });
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatDetailsPage');
  }

  // ionViewDidEnter() {
  //   this.content.scrollToBottom(300);
  // }

  openProfile() {
    let profilePage: any = this.navCtrl.getViews().find(itm => itm.name === "UserProfilePage") || UserProfilePage;
    this.navCtrl.push(profilePage, { profile: this.receiver }, { animate: true });
  }

  sendMessage() {
    if (this.messageToSend.trim().length < 1) return;
    if (this.chatId === undefined) {
      this.chatService.getChatId(this.sender, this.receiver).then(response => {
        this.chatId = response;
        this.messages = this.db.list("messages/" + this.chatId);
        this.messages.subscribe(data => {
          // scroll to the bottom
          this.content.scrollToBottom(250);
        });
        this.chatService.sendMessage(this.chatId, this.sender, this.receiver, this.messageToSend);
        this.messageToSend = "";

      }).catch(error => {
        console.log("sendMessage error:", error);
      });
    }
    else {
      this.chatService.sendMessage(this.chatId, this.sender, this.receiver, this.messageToSend);
      this.messageToSend = "";
    }
  }


  /**
   * Date Format Helper
   */
  getDateFormated(value: Date): string {
    return moment(value).fromNow();
  }


}
