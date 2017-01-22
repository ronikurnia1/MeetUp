import { Component } from "@angular/core";
import { App, NavController, NavParams, Tabs, AlertController } from "ionic-angular";
import { GlobalVarsService } from "../../providers/global-vars-service";

import { ScanAttendancePage } from "../scan-attendance/scan-attendance";
import { UserProfilePage } from "../user-profile/user-profile";
import { AnnouncementPage } from "../announcement/announcement";

import { LoginPage } from "../login/login";

@Component({
  selector: "page-menu",
  templateUrl: "menu.html"
})
export class MenuPage {
  private tabs: Tabs;
  private user: any;
  private userProfilePage: any;

  items = [];

  fullMenus = [
    {
      "title": "Scan Attendance",
      "page": ScanAttendancePage,
      "icon": "qr-scanner",
      "color": "#4CAF50"
    },
    {
      "title": "Staff Dashboard",
      "icon": "stats",
      "color": "#4CAF50"
    }
  ];
  limitedMenus = [
    {
      "title": "Announcement/Message",
      "page": AnnouncementPage,
      "icon": "megaphone",
      "color": "#4CAF50"
    }
  ];
  sharedMenus = [
    {
      "title": "My Favorites",
      "icon": "heart",
      "color": "#4CAF50"
    },
    {
      "title": "Speakers",
      "icon": "people",
      "color": "#4CAF50"
    },
    {
      "title": "Agenda",
      "icon": "calendar",
      "color": "#4CAF50"
    },
    {
      "title": "Venue",
      "icon": "pin",
      "color": "#4CAF50"
    },
    {
      "title": "Technologies",
      "icon": "school",
      "color": "#4CAF50"
    },
    {
      "title": "Logout",
      "page": LoginPage,
      "icon": "power",
      "color": "#E63135"
    }
  ];

  constructor(
    private app: App,
    private navCtrl: NavController,
    private navParams: NavParams,
    private globalVars: GlobalVarsService,
    private alertCtrl: AlertController) {

    this.userProfilePage = UserProfilePage;
    this.tabs = navCtrl.parent;

    // prepare menu
    this.prepareMenus();
  }

  /**
   * Handle menu pressed
   */
  private menuSelected(page: any) {
    let navOptions = { animate: true };

    if (page) {
      // login page
      if (page.name === "LoginPage") {
        // remove userData
        localStorage.clear();
        // move to the defaut tabs
        // this.tabs.select(0);

        let loginPage = this.app.getRootNav().getViews().find(itm => itm.name === "LoginPage") || page;
        //this.app.getRootNav().push(loginPage, null, navOptions);
        this.app.getRootNav().setRoot(loginPage, null, navOptions);
      } else {
        // others than login page
        // check if page exist
        let pageToLoad = this.navCtrl.getViews().find(itm => itm.name === page.name) || page;
        this.navCtrl.push(pageToLoad, null, navOptions).then(data => { });
      }
    }
    else {
      let alert = this.alertCtrl.create({
        title: "Not Implemented",
        subTitle: "Feature is not implemented yet!",
        buttons: ['OK']
      });
      alert.present();
    }
  }

  prepareMenus() {
    //check the user type
    this.user = this.globalVars.getValue("userData");
    let userType: string = this.user.userType;
    this.items = [];

    switch (userType.toLowerCase()) {
      case "admin":
      case "ipi staff":
      case "event organizer": {
        this.items = this.fullMenus.concat(this.sharedMenus);
        break;
      }
      default: {
        // this.items = this.limitedMenus.concat(this.sharedMenus);
        this.items = this.sharedMenus.slice();
        this.items.splice(1, 0, this.limitedMenus[0]);
        break;
      }
    }
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad MenuPage");
  }
  ionViewWillEnter() {
    this.prepareMenus();
  }
}
