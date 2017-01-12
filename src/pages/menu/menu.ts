import { Component } from "@angular/core";
import { App, NavController, NavParams, Tabs, AlertController } from "ionic-angular";
import { GlobalVarsService } from "../../providers/global-vars-service";

import { ScanAttendancePage } from "../scan-attendance/scan-attendance";
import { UserProfilePage } from "../user-profile/user-profile";

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
      "title": "Arrage Meeting",
      "icon": "contacts",
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
      "title": "My Favorites",
      "icon": "heart",
      "color": "#4CAF50"
    },
    {
      "title": "Announcement/Message",
      "icon": "megaphone",
      "color": "#4CAF50"
    }
  ];
  sharedMenus = [
    {
      "title": "About Techinnovation",
      "icon": "information-circle",
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
      "title": "For Exhibitors",
      "icon": "cube",
      "color": "#4CAF50"
    },
    {
      "title": "Venue",
      "icon": "pin",
      "color": "#4CAF50"
    },
    {
      "title": "Partners",
      "icon": "body",
      "color": "#4CAF50"
    },
    {
      "title": "Technologies",
      "icon": "school",
      "color": "#4CAF50"
    },
    {
      "title": "Press",
      "icon": "paper",
      "color": "#4CAF50"
    },
    {
      "title": "Gallery",
      "icon": "images",
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

  navigateToPage(page) {
    // console.log("Navigation:", page);
    // Publish menu selected event    
    //this.events.publish(this.menuSelectedEvent, { page: page, params: null });
    this.menuSelected(page);
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
        this.tabs.select(0);
        let loginView = this.app.getRootNav().getViews().find(itm => itm.name === "LoginPage")
        if (loginView) {
          console.log("login page exist");
          this.app.getRootNav().push(loginView, null, navOptions);
        }
        else {
          console.log("no login page");
          this.app.getRootNav().push(page, null, navOptions);
        }
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

    switch (userType) {
      case "admin":
      case "IPI staff": {
        this.items = this.fullMenus.concat(this.sharedMenus);
        break;
      }
      default: {
        this.items = this.limitedMenus.concat(this.sharedMenus);
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
