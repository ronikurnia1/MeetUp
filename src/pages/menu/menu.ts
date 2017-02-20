import { Component, NgZone, ViewChild } from "@angular/core";
import { App, NavController, NavParams, Tabs, AlertController, Content } from "ionic-angular";
import { GlobalVarsService } from "../../providers/global-vars-service";

import { UserProfilePage } from "../user-profile/user-profile";
import { MyQrCodePage } from "../my-qr-code/my-qr-code";


import { ScanAttendancePage } from "../scan-attendance/scan-attendance";
import { AnnouncementPage } from "../announcement/announcement";
import { FloorPlanPage } from "../floor-plan/floor-plan";
import { LoginPage } from "../login/login";

@Component({
  selector: "page-menu",
  templateUrl: "menu.html"
})
export class MenuPage {
  private tabs: Tabs;
  private user: any;
  private userProfilePage: any;
  private myQrCodePage: any;

  @ViewChild("menuContent")
  public content: Content;

  items = [];

  fullMenus: any[] = [
    {
      title: "Scan Attendance",
      page: ScanAttendancePage,
      icon: "qr-scanner",
      color: "#4CAF50"
    },
    {
      title: "Staff Dashboard",
      icon: "stats",
      page: AnnouncementPage,
      color: "#4CAF50"
    }
  ];
  limitedMenus = [
    {
      title: "Announcement/Message",
      page: AnnouncementPage,
      icon: "megaphone",
      color: "#4CAF50"
    }
  ];
  sharedMenus: any[] = [
    {
      title: "Speakers",
      icon: "people",
      page: AnnouncementPage,
      color: "#4CAF50"
    },
    {
      title: "Agenda",
      page: AnnouncementPage,
      icon: "calendar",
      color: "#4CAF50"
    },
    {
      title: "Venue",
      icon: "pin",
      page: FloorPlanPage,
      color: "#4CAF50"
    },
    {
      title: "Technologies",
      page: AnnouncementPage,
      icon: "school",
      color: "#4CAF50"
    },
    {
      title: "Logout",
      page: LoginPage,
      icon: "power",
      color: "#E63135"
    }
  ];

  constructor(
    private app: App,
    private navCtrl: NavController,
    private navParams: NavParams,
    private zone: NgZone,
    private globalVars: GlobalVarsService,
    private alertCtrl: AlertController) {

    this.userProfilePage = UserProfilePage;
    this.myQrCodePage = MyQrCodePage;
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
        localStorage.removeItem("userData");
        // move to the defaut tabs
        // this.tabs.select(0);

        let loginPage = this.app.getRootNav().getViews().find(itm => itm.name === "LoginPage") || page;
        //this.app.getRootNav().push(loginPage, null, navOptions);
        this.app.getRootNav().setRoot(loginPage, null, navOptions);
      } else {
        // others than login page
        // check if page exist
        // let pageToLoad = this.navCtrl.getViews().find(itm => itm.name === page.name) || page;
        // this.navCtrl.push(pageToLoad, null, navOptions).then(data => { });

        let tabs: Tabs = this.navCtrl.parent;
        let pageToLoad: any = tabs.parent.getViews().find(itm => itm.name === page.name) || page;
        tabs.parent.push(pageToLoad, null, navOptions);

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
    // console.log("user",JSON.stringify(this.user));
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
        this.items = this.limitedMenus.concat(this.sharedMenus);
        break;
      }
    }
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad MenuPage");
  }
  ionViewWillEnter() {
    this.zone.run(() => {
      this.prepareMenus();
      // scroll to the bottom
      this.content.scrollToTop(250);
    });

  }
}
