import { Component, ViewChild, NgZone, ChangeDetectionStrategy } from '@angular/core';
import { NavController, NavParams, Content, ToastController } from 'ionic-angular';
import * as moment from "moment";
import { UserProfilePage } from "../user-profile/user-profile";
import { GlobalVarsService } from "../../providers/global-vars-service";
import { AuthService } from "../../providers/auth-service";
import { AngularFireDatabase, FirebaseListObservable } from "angularfire2";
import { FirebaseChatService } from "../../providers/firebase-chat-service";
import { Observable } from "rxjs/Observable";

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

  private chatId: string;

  private messages: FirebaseListObservable<any[]>;
  private messageToSend: string = "";

  private firebaseSubs: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private chatService: FirebaseChatService,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private db: AngularFireDatabase,
    private zone: NgZone,
    private globalVars: GlobalVarsService) {

    this.receiver = navParams.get("receiver");
    this.sender = navParams.get("sender");

    this.chatId = this.navParams.get("chatId");

    this.loadTheChat();

  }

  loadTheChat() {
    if (this.chatId !== undefined) {
      this.messages = this.db.list("messages/" + this.chatId);
      this.firebaseSubs = this.messages.subscribe(data => {
        // scroll to the bottom
        if (this.content)
          this.content.scrollToBottom(250);
      });
    }
  }

  // ionViewDidEnter() {
  //   this.content.scrollToBottom(300);
  // }

  ionViewWillLeave() {
    if (this.firebaseSubs) {
      this.firebaseSubs.unsubscribe();
    }
  }
  openProfile() {
    let profilePage: any = this.navCtrl.getViews().find(itm => itm.name === "UserProfilePage") || UserProfilePage;

    // get profile 
    // TODO: please double check!
    this.authService.getProfile("099e203a-4acf-6092-98b9-ff00006fb7ad").subscribe(respose => {
      if (respose.result === "OK") {
        this.navCtrl.push(profilePage, { profile: respose.user }, { animate: true });
      } else {
        this.showToast(respose.message);
      }
    }, error => {
      this.showToast(error);
    });

  }

  showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: "bottom"
    });
    toast.present();
  }

  sendMessage() {
    if (this.messageToSend.trim().length < 1) return;
    if (this.chatId === undefined) {
      // console.log("Id", this.sender.id);
      this.chatService.getChatId(this.sender, this.receiver).then(response => {
        this.chatId = response;
        this.loadTheChat();
        this.chatService.sendMessage(this.chatId, this.sender, this.receiver, this.messageToSend);
        this.zone.run(() => {
          this.messageToSend = "";
        });

      }).catch(error => {
        console.log("sendMessage error:", error);
      });
    }
    else {
      this.chatService.sendMessage(this.chatId, this.sender, this.receiver, this.messageToSend);
      this.zone.run(() => {
        this.messageToSend = "";
      });
    }
  }


  /**
   * Date Format Helper
   */
  getDateFormated(value: Date): string {
    return moment(value).fromNow();
  }


}
