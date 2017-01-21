import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as moment from "moment";
import { UserProfilePage } from "../user-profile/user-profile";
import { GlobalVarsService } from "../../providers/global-vars-service";

@Component({
  selector: 'page-chat-details',
  templateUrl: 'chat-details.html'
})
export class ChatDetailsPage {

  private profile: any;
  private inputRow: number = 4;
  private myAvatar: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private globalVars: GlobalVarsService) {
    this.profile = navParams.get("profile");

    this.myAvatar = this.globalVars.getValue("userData").avatar;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatDetailsPage');
  }


  openProfile() {
    let profilePage: any = this.navCtrl.getViews().find(itm => itm.name === "UserProfilePage") || UserProfilePage;
    this.navCtrl.push(profilePage, { profile: this.profile }, { animate: true });
  }
}
