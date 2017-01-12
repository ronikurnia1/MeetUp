import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController, Events } from 'ionic-angular';
import { GlobalVarsService } from "../../providers/global-vars-service";
import { PopoverPage } from "./popover";
import { RegisterPage } from "../register/register";
import { ChangePasswordPage } from "../change-password/change-password";
import { MyQrCodePage } from "../my-qr-code/my-qr-code";

@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html'
})
export class UserProfilePage {
  private profile: UserProfile;

  private userProfileMenu: string = "menu:userProfile";

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private globalVars: GlobalVarsService,
    private popoverCtrl: PopoverController,
    private events: Events) {
    // Get profile
    this.profile = globalVars.getValue("userData");

    // subscribe to the PopoverPage
    events.subscribe(this.userProfileMenu, (menu) => {
      // console.log("menu", menu);
      this.handleMenu(menu);
    });
  }

  ionViewWillEnter() {
    // Get profile
    this.profile = this.globalVars.getValue("userData");
  }

  handleMenu(menu: any) {
    switch (menu.param) {
      case "editProfile": {
        let page = this.navCtrl.getViews().find(itm => itm.name === "RegisterPage") || RegisterPage;
        this.navCtrl.push(page, { title: "Edit Profile" }, { animate: true });
        break;
      }
      case "changePassword": {
        let page = this.navCtrl.getViews().find(itm => itm.name === "ChangePasswordPage") || ChangePasswordPage;
        this.navCtrl.push(page, null, { animate: true });
        break
      }
      default: {
        let page = this.navCtrl.getViews().find(itm => itm.name === "MyQrCodePage") || MyQrCodePage;
        this.navCtrl.push(page, null, { animate: true });
        break;
      }
    }
  }

  showMoreMenu(event: Event) {
    let menus = [
      { title: "Edit profile", param: "editProfile", eventName: this.userProfileMenu },
      { title: "Change password", param: "changePassword", eventName: this.userProfileMenu },
      { title: "My QR code", param: "myQrCode", eventName: this.userProfileMenu }
    ];
    let popover = this.popoverCtrl.create(PopoverPage, menus);
    popover.present({ ev: event });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserProfilePage');
  }

  ionViewWillUnload() {
    this.events.unsubscribe(this.userProfileMenu);
  }
}

export interface UserProfile {
  id: string,
  fullName: string,
  mobile: string,
  emailAddrss: string,
  company: string,
  position: string,
  country: string,
  userType: string,
  isAdmin: boolean,
  description: string
}