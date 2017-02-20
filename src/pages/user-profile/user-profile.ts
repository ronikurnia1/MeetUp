import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController, Events, ToastController } from 'ionic-angular';
import { GlobalVarsService } from "../../providers/global-vars-service";
import { RegisterPage } from "../register/register";
import { ChangePasswordPage } from "../change-password/change-password";
import { MyQrCodePage } from "../my-qr-code/my-qr-code";
import { ArrangeMeetingPage } from "../arrange-meeting/arrange-meeting";

@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html'
})
export class UserProfilePage {
  private myProfile: boolean = false;
  private profile: UserProfile;
  private pageTitle: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private globalVars: GlobalVarsService,
    private toastCtrl: ToastController,
    private events: Events) {

    // Get profile
    if (navParams.get("profile")) {
      this.profile = navParams.get("profile");
      this.pageTitle = "Profile";
    } else {
      this.myProfile = true;
      this.profile = globalVars.getValue("userData");
      this.pageTitle = "My Profile";
    }
  }

  ionViewWillEnter() {
    // Get profile
    if (this.myProfile) {
      this.profile = this.globalVars.getValue("userData");
    }
  }

  handleMenu(menu: string) {
    event.stopPropagation();
    event.preventDefault();
    switch (menu) {
      case "editProfile": {
        this.globalVars.getCountries().subscribe(response => {
          if (response.result === "OK") {
            this.globalVars.getClassification("industry-type").subscribe(res => {
              if (res.result === "OK") {
                let register = this.navCtrl.getViews().find(itm => itm.name === "RegisterPage") || RegisterPage;
                this.navCtrl.push(register, {
                  title: "Edit Profile",
                  countries: response.countries,
                  industries: res.data,
                  jobLevels: response.jobLevels,
                  jobRoles: response.jobRoles,
                  titles: response.titles,
                  notifications: response.notificationMethods
                });
              } else {
                let toast = this.toastCtrl.create({
                  message: res.Message,
                  duration: 3000,
                  position: "bottom"
                });
                toast.present();
              }
            }, err => {
              // show toast
              let toast = this.toastCtrl.create({
                message: err,
                duration: 3000,
                position: "bottom"
              });
              toast.present();
            });
          } else {
            let toast = this.toastCtrl.create({
              message: response.Message,
              duration: 3000,
              position: "bottom"
            });
            toast.present();
          }
        }, (error) => {
          // show toast
          let toast = this.toastCtrl.create({
            message: error,
            duration: 3000,
            position: "bottom"
          });
          toast.present();
        });
        break;
      }
      case "changePassword": {
        let page = this.navCtrl.getViews().find(itm => itm.name === "ChangePasswordPage") || ChangePasswordPage;
        this.navCtrl.push(page, null, { animate: true });
        break
      }
      default: {
        // console.log("View meeting details.");
        let arrangeMeeting = this.navCtrl.getViews().find(itm => itm.name === "ArrangeMeetingPage") || ArrangeMeetingPage;
        this.navCtrl.push(arrangeMeeting, { selectedUser: this.profile }, { animate: true });
        break;
      }
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserProfilePage');
  }

  ionViewWillUnload() {
    // this.events.unsubscribe(this.userProfileMenu);
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