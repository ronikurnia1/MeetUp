import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UserProfilePage } from "../user-profile/user-profile";

@Component({
  selector: 'page-chat-details',
  templateUrl: 'chat-details.html'
})
export class ChatDetailsPage {

  private profile: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams) {
    this.profile = navParams.get("profile");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatDetailsPage');
  }


  openProfile() {
    let profilePage: any = this.navCtrl.getViews().find(itm => itm.name === "UserProfilePage") || UserProfilePage;
    this.navCtrl.push(profilePage, { profile: this.profile }, { animate: true });
  }
}
