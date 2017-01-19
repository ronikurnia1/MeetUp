import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, Tabs } from 'ionic-angular';
import { GlobalVarsService } from "../../providers/global-vars-service";
import { MeetingService } from "../../providers/meeting-service";
import { ChatDetailsPage } from "../chat-details/chat-details";
import { FindUserPage } from "../find-user/find-user";

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html'
})
export class ChatPage {

  users: any[];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private meetingService: MeetingService,
    private globalVars: GlobalVarsService,
    private toastCtrl: ToastController) {

    this.users = [];
    this.getChatList();
  }

  userSelected(profile: any) {
    event.stopPropagation();
    event.preventDefault();
    // let chatDetails = this.navCtrl.getViews().find(itm => itm.name === "ChatDetailsPage") || ChatDetailsPage;
    // get chat details
    // this.meetingService.getMeetingById(meeting.id).subscribe(response => {
    // this.navCtrl.push(chatDetails, { meetingData: response });
    // });
    let tabs: Tabs = this.navCtrl.parent;
    let chatDetails: any = tabs.parent.getViews().find(itm => itm.name === "ChatDetailsPage");
    if (chatDetails) {
      console.log("Exist");
    } else {
      chatDetails = ChatDetailsPage;
    }
    tabs.parent.push(chatDetails, { profile: profile }, { animate: true });

    // let toast = this.toastCtrl.create({
    //   message: "Chat has not been implemented yet.",
    //   duration: 3000,
    //   position: "bottom"
    // });
    // toast.present();
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
    this.users = [];
    this.meetingService.getChatList(this.globalVars.getValue("userData").email).subscribe(response => {
      response.data.forEach(itm => this.users.push(itm));
    });
  }

  ionViewWillEnter() {
    this.getChatList();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
  }

}
