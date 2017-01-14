import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { GlobalVarsService } from "../../providers/global-vars-service";
import { MeetingService } from "../../providers/meeting-service";

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

  userSelected() {
    let toast = this.toastCtrl.create({
      message: "Chat has not been implemented yet.",
      duration: 3000,
      position: "bottom"
    });
    toast.present();
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
