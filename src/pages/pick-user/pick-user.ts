import { Component } from '@angular/core';
import {
  NavController, NavParams, LoadingController, Platform,
  PopoverController, Events, AlertController, ToastController
} from 'ionic-angular';
import { PopoverPage } from "../user-profile/popover";
import { GlobalVarsService } from "../../providers/global-vars-service";
import { MeetingService } from "../../providers/meeting-service";
import { ArrangeMeetingPage } from "../arrange-meeting/arrange-meeting";

@Component({
  selector: 'page-pick-user',
  templateUrl: 'pick-user.html'
})
export class PickUserPage {

  private filterUserMenu: string = "menu:filerUser";
  private title: string;
  private keywords: string;
  private group: string;
  private currentPageIndex: number;
  private infiniteScroll: any;

  private deletegeFilter = [
    { title: "All User Group", param: "all", eventName: this.filterUserMenu },
    { title: "Exhibitors", param: "exhibitor", eventName: this.filterUserMenu },
    { title: "Speakers", param: "speaker", eventName: this.filterUserMenu },
    { title: "IPI Staff", param: "ipi-staff", eventName: this.filterUserMenu }
  ];
  private nonDeletegeFilter = [
    { title: "All User Group", param: "all", eventName: this.filterUserMenu },
    { title: "Delegates", param: "delegate", eventName: this.filterUserMenu },
    { title: "Exhibitors", param: "exhibitor", eventName: this.filterUserMenu },
    { title: "Speakers", param: "speaker", eventName: this.filterUserMenu },
    { title: "IPI Staff", param: "ipi-staff", eventName: this.filterUserMenu },
    { title: "Event Organizer", param: "event-organizer", eventName: this.filterUserMenu }
  ];

  users: any = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams, private toastCtrl: ToastController,
    private loadCtrl: LoadingController,
    private events: Events, private platform: Platform,
    private globalVars: GlobalVarsService,
    private meetingService: MeetingService,
    private alertCtrl: AlertController,
    private popoverCtrl: PopoverController) {

    this.title = "All User Group";
    this.group = "all";
    this.keywords = "";
    this.currentPageIndex = 1;
    // subscribe to the PopoverPage
    events.subscribe(this.filterUserMenu, (menu) => {
      //console.log("menu", menu);
      this.handleFilter(menu);
    });
    this.users = [];
  }

  filterUser(event: any) {
    // display popover
    let menus = this.globalVars.getValue("userData").userType.toLowerCase() === "Delegates" ?
      this.deletegeFilter : this.nonDeletegeFilter;
    let popover = this.popoverCtrl.create(PopoverPage, menus);

    let left = this.platform.is("android") ? (this.platform.width() / 2) - 125 : (this.platform.width() / 2);
    let top = this.platform.is("android") ? 34 : 22;
    let ev = {
      target: {
        getBoundingClientRect: () => {
          return {
            top: top,
            left: left
          };
        }
      }
    };
    popover.present({ ev });
  }


  /**
   * Get user based on group & keywords/filter
   */
  searchUser(keywords: string, withLoader: boolean, userType: string, pageIndex: number, refresher?: any) {
    let loader: any;
    if (withLoader) {
      loader = this.loadCtrl.create({
        content: "Please wait..."
      });
      loader.present();
    }

    //this.users = [];
    this.meetingService.getUsers(keywords, userType, pageIndex).subscribe(response => {
      if (response.result === "OK") {
        // TODO: implement filtering
        if (this.group !== "all") {
          (response.users as any[]).filter(itm => itm.userTypeName === this.group).forEach(user => {
            this.users.push(user);
          });
          // console.log("with filter:", this.users.length);
        } else {
          response.users.forEach(user => {
            this.users.push(user);
          });
          // console.log("no filter:", this.users.length);
        }
      } else {
        this.alertUser("Retrieve users failed.", response.message);
      }
      if (loader)
        loader.dismissAll();

      if (refresher)
        refresher.complete();

      if (this.infiniteScroll)
        this.infiniteScroll.complete();

    }, error => {
      if (loader)
        loader.dismissAll();

      if (refresher)
        refresher.complete();

      if (this.infiniteScroll)
        this.infiniteScroll.complete();

      // show toast
      let toast = this.toastCtrl.create({
        message: error,
        duration: 3000,
        position: "bottom"
      });
      toast.present();
    });
  }

  refreshData(refresher: any) {
    this.currentPageIndex = 1;
    this.users = [];
    this.searchUser(this.keywords, true, this.group, this.currentPageIndex, refresher);
  }

  handleFilter(menu: any) {
    this.title = menu.title;
    this.group = menu.param;
    this.currentPageIndex = 1;
    this.users = [];
    // do user searching
    this.searchUser(this.keywords, false, this.group, this.currentPageIndex, undefined);
  }


  putKeyword(event: any) {
    let keywords = event.target.value || "";
    this.currentPageIndex = 1;
    this.users = [];
    // do user searching
    this.searchUser(keywords, false, this.group, this.currentPageIndex, undefined);
  }

  doInfinite(infiniteScroll: any) {
    this.infiniteScroll = infiniteScroll;
    this.currentPageIndex += 1;
    this.searchUser(this.keywords, false, this.group, this.currentPageIndex, undefined);
  }


  userSelected(user: any) {
    event.stopPropagation();
    event.preventDefault();
    if (this.navParams.get("partyType")) {
      // pick-up with callback
      this.navParams.get("callback")({ selectedUser: user, partyType: this.navParams.get("partyType") }).then(() => {
        this.navCtrl.pop();
      });
    } else {
      //let arrangeMeeting = this.navCtrl.getViews().find(itm => itm.name === "ArrangeMeetingPage") || ArrangeMeetingPage;
      this.navCtrl.pop().then(value => {
        this.navCtrl.push(ArrangeMeetingPage, { selectedUser: user }, { animate: true });
      });
    }
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad PickUserPage');
    this.searchUser(this.keywords, true, this.group, this.currentPageIndex, undefined);
  }

  ionViewWillUnload() {
    this.events.unsubscribe(this.filterUserMenu);
  }

  alertUser(title: string, message: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

}
