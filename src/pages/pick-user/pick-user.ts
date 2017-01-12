import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController, Events } from 'ionic-angular';
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

  private deletegeFilter = [
    { title: "All Attendees", param: "allAttendees", eventName: this.filterUserMenu },
    { title: "Exhibitors", param: "exhibitors", eventName: this.filterUserMenu },
    { title: "Speakers", param: "speakers", eventName: this.filterUserMenu },
    { title: "IPI Staff", param: "IpiStaff", eventName: this.filterUserMenu }
  ];
  private nonDeletegeFilter = [
    { title: "All Attendees", param: "allAttendees", eventName: this.filterUserMenu },
    { title: "Delegates", param: "delegates", eventName: this.filterUserMenu },
    { title: "Exhibitors", param: "exhibitors", eventName: this.filterUserMenu },
    { title: "Speakers", param: "speakers", eventName: this.filterUserMenu },
    { title: "IPI Staff", param: "IpiStaff", eventName: this.filterUserMenu },
    { title: "Event Organizer", param: "eventOrganizer", eventName: this.filterUserMenu }
  ];

  users: any[];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private popoverCtrl: PopoverController,
    private events: Events,
    private globalVars: GlobalVarsService,
    private meetingService: MeetingService) {

    this.title = "All Attendees";
    this.group = "allAttendees";
    this.keywords = "";
    // subscribe to the PopoverPage
    events.subscribe(this.filterUserMenu, (menu) => {
      //console.log("menu", menu);
      this.handleFilter(menu);
    });
    this.users = [];
    this.searchUser();
  }

  filterUser(event: any) {
    // display popover
    let menus = this.globalVars.getValue("userData").userType.toLowerCase() === "Delegates" ?
      this.deletegeFilter : this.nonDeletegeFilter;
    let popover = this.popoverCtrl.create(PopoverPage, menus);
    popover.present({ ev: event });
  }


  /**
   * Get user based on group & keywords/filter
   */
  searchUser() {
    this.users = [];
    this.meetingService.getUsers(this.group, this.keywords).subscribe(data => {
      data.forEach(itm => this.users.push(itm));
    });
  }

  handleFilter(menu: any) {
    this.title = menu.title;
    this.group = menu.param;
    // do user searching
    this.searchUser();
  }

  userSelected(user: any) {
    event.stopPropagation();
    event.preventDefault();
    // console.log("View meeting details.");
    let arrangeMeeting = this.navCtrl.getViews().find(itm => itm.name === "ArrangeMeetingPage") || ArrangeMeetingPage;
    this.navCtrl.push(arrangeMeeting, { selectedUser: user }, { animate: true });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PickUserPage');
  }

  ionViewWillUnload() {
    this.events.unsubscribe(this.filterUserMenu);
  }

}
