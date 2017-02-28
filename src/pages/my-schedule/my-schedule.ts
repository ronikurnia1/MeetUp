import { Component, NgZone, ViewChild } from "@angular/core";
import {
  App, NavController, NavParams, ToastController,
  Events, Tabs, AlertController, PopoverController,
  Platform, Content
} from "ionic-angular";
import * as moment from "moment";
// import { Meeting } from "../../domain/meeting";
import { MeetingService } from "../../providers/meeting-service";
import { GlobalVarsService } from "../../providers/global-vars-service";
import { MeetingDetailsPage } from "../meeting-details/meeting-details";
import { CalendarViewPage } from "../calendar-view/calendar-view";
import { CancelOrDeclinePage } from "../cancel-or-decline/cancel-or-decline";
import { RescheduleMeetingPage } from "../reschedule-meeting/reschedule-meeting";
import { BlockTimePage } from "../block-time/block-time";
import { PickUserPage } from "../pick-user/pick-user";
import { BarcodeScanner, Calendar } from "ionic-native";
import { AuthService } from "../../providers/auth-service";
import { ScanBadgePage } from "../scan-badge/scan-badge";
import { PopoverPage } from "../user-profile/popover";
import { AdminArrangeMeetingPage } from "../admin-arrange-meeting/admin-arrange-meeting";


@Component({
  selector: "page-my-schedule",
  templateUrl: "my-schedule.html"
})
export class MySchedulePage {
  private acceptInvitationSuccess: string = "meeting:acceptInvitationSuccess";
  private declineInvitaionSuccess: string = "meeting:declineInvitationSuccess";
  private cancelMeetingSuccess: string = "meeting:cancelMeetingSuccess"; 
  private inviteMeetingSuccess: string = "meeting:inviteMeetingSuccess";

  private tabs: Tabs;

  private section: string = "My Schedule";

  private schedules: Array<any> = [];

  private invitations: Array<any> = [];
  private hostings: Array<any> = [];

  private fullInvitations: Array<any> = [];
  private fullHostings: Array<any> = [];

  private filterInvitation: string = "";
  private filterHosting: string = "";

  private statusFilter: string = "All";
  private meetingStatus: string = "all";

  private filterStatusMenu: "menu:filterStatus"


  private statusFilters = [
    { title: "All", param: "all", eventName: this.filterStatusMenu },
    { title: "Pending", param: "pending", eventName: this.filterStatusMenu },
    { title: "Confirmed", param: "confirmed", eventName: this.filterStatusMenu },
    { title: "Cancelled", param: "cancelled", eventName: this.filterStatusMenu }
  ];


  private day1: string;
  private day2: string;
  private daySelected: string;

  @ViewChild("pageContent")
  public content: Content;

  constructor(
    public app: App,
    public navCtrl: NavController,
    public navParams: NavParams,
    private toastCtrl: ToastController,
    private meetingService: MeetingService,
    private globalVars: GlobalVarsService,
    private zone: NgZone,
    private events: Events,
    private alertCtrl: AlertController,
    private authService: AuthService,
    private popoverCtrl: PopoverController,
    private platform: Platform) {

    // Hold reference to the Tabs
    this.tabs = navCtrl.parent;

    // Subscribe to the event published by MeetingDetailsPage
    events.subscribe(this.acceptInvitationSuccess, (meetingData: any) => {
      // remove appropriate invitaion
      this.removeInvitaion(meetingData);
      this.getMeetingSchedule(null);
    });
    // Subscribe to the event published by CancelOrDeclinePage
    events.subscribe(this.declineInvitaionSuccess, (meetingData: any) => {
      // remove appropriate invitaion
      this.removeInvitaion(meetingData);
    });
    // Subscribe to the event published by CancelOrDeclinePage
    events.subscribe(this.cancelMeetingSuccess, (meetingData: any) => {
      // remove appropriate hosting
      this.removeHosting(meetingData);
      this.removeSchedule(meetingData);
    });
    // Subscribe to the event published by CancelOrDeclinePage
    events.subscribe(this.inviteMeetingSuccess, (meetingData: any) => {
      // update Sent Tab
      this.getSentMeetings();
    });

    // subscribe to the PopoverPage
    events.subscribe(this.filterStatusMenu, (menu) => {
      //console.log("menu", menu);
      this.handleFilter(menu);
    });

  }

  toggleDay(value: string) {
    this.daySelected = value;
  }

  handleFilter(menu: any) {
    this.statusFilter = menu.title;
    this.meetingStatus = menu.param;
  }

  filterStatus() {
    if (this.section !== "Sent") return;
    // display popover
    let popover = this.popoverCtrl.create(PopoverPage, this.statusFilters);
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

  ionViewDidLoad() {
    // console.log("ionViewDidLoad MySchedulePage");
  }

  ionViewWillEnter() {
    let userType: string = this.globalVars.getValue("userData").userType;
  }

  ionViewWillUnload() {
    // unsubscribe events
    console.log("Unsubscribing");
    this.events.unsubscribe(this.acceptInvitationSuccess);
    this.events.unsubscribe(this.declineInvitaionSuccess);
    this.events.unsubscribe(this.cancelMeetingSuccess);
    this.events.unsubscribe(this.inviteMeetingSuccess);
    this.events.unsubscribe(this.filterStatusMenu);
  }

  cancelMeeting(data: any) {
    event.stopPropagation();
    event.preventDefault();
    let cancelDecline = this.navCtrl.getViews().find(itm => itm.name === "CancelOrDeclinePage");
    if (cancelDecline) {
      this.navCtrl.push(cancelDecline, { meetingData: data, type: "cancel" });
    } else {
      this.navCtrl.push(CancelOrDeclinePage, { meetingData: data, type: "cancel" });
    }
  }

  // withdrawAcceptedMeeting(data: any) {
  //   event.stopPropagation();
  //   event.preventDefault();
  //   console.log("Withdraw Meeting.");
  //   let cancelDecline = this.navCtrl.getViews().find(itm => itm.name === "CancelOrDeclinePage");
  //   if (cancelDecline) {
  //     this.navCtrl.push(cancelDecline, { meetingData: data, type: "withdraw" });
  //   } else {
  //     this.navCtrl.push(CancelOrDeclinePage, { meetingData: data, type: "withdraw" });
  //   }
  // }

  rescheduleMeeting(data: any) {
    event.stopPropagation();
    event.preventDefault();
    let minDate = this.globalVars.getValue("day1");
    let maxDate = this.globalVars.getValue("day2");
    let reschedule = this.navCtrl.getViews().find(itm => itm.name === "RescheduleMeetingPage") || RescheduleMeetingPage;
    this.navCtrl.push(reschedule, { meetingData: data, minDate: minDate, maxDate: maxDate });
  }

  acceptMeeting(meeting: any) {
    event.stopPropagation();
    event.preventDefault();
    // console.log("Accept Meeting.");

    this.meetingService.acceptInvitation(meeting.id, this.globalVars.getValue("userData").email)
      .subscribe(response => {
        let message: string = "";
        // console.log("Response:", data);
        if (response.result === "OK") {
          message = "You have accepted the invitation.";
          // remove the invitaion
          setTimeout(() => {
            this.removeInvitaion(meeting);
            this.getMeetingSchedule(null);
          }, 2000);
        } else {
          message = response.message;
        }
        this.showToast(message);
      });
  }

  declineMeeting(data: any) {
    event.stopPropagation();
    event.preventDefault();
    // console.log("Decline Meeting.");
    let cancelDecline = this.navCtrl.getViews().find(itm => itm.name === "CancelOrDeclinePage") || CancelOrDeclinePage;
    this.navCtrl.push(cancelDecline, { meetingData: data, type: "decline" });
  }

  /**
 * Arrange Meeting
 */
  arrangeMeeting(eventData: Event) {
    event.stopPropagation();
    event.preventDefault();
    //check the user type
    let userType: string = this.globalVars.getValue("userData").userType;
    let page: any;

    let tabs: Tabs = this.navCtrl.parent;

    switch (userType.toLowerCase()) {
      case "admin":
      case "ipi staff":
      case "event organizer": {
        page = tabs.parent.getViews().find(itm => itm.name === "AdminArrangeMeetingPage") || AdminArrangeMeetingPage;
        break;
      }
      default: {
        page = tabs.parent.getViews().find(itm => itm.name === "PickUserPage") || PickUserPage;
        break;
      }
    }
    tabs.parent.push(page, null, { animate: true });
  }

  /**
   * Open Calender
   */
  viewCalendar(event: Event) {
    // console.log("View Calender.");
    event.stopPropagation();
    event.preventDefault();
    let calendarView = this.navCtrl.getViews().find(itm => itm.name === "CalendarViewPage") || CalendarViewPage;
    this.navCtrl.push(calendarView);
  }

  ngOnInit() {
    // Get today's meeting schedule data
    this.getMeetingSchedule();
    // Get invitaion
    this.getMeetingInvitaions();
    // Get Sent
    this.getSentMeetings();
  }


  /**
   * Get today's meeting schedule of logged user
   */
  getMeetingSchedule(refresher?: any) {
    this.schedules = [];
    let userId: string = this.globalVars.getValue("userData").id;

    this.meetingService.getMeetingDate().subscribe(res => {
      this.day1 = res.data[0].id; //.substr(6, 4) + "-" + res.data[0].id.substr(3, 2) + "-" + res.data[0].id.substr(0, 2);
      this.day2 = res.data[1].id; //.substr(6, 4) + "-" + res.data[1].id.substr(3, 2) + "-" + res.data[1].id.substr(0, 2);

      let minDate = this.day1.substr(6, 4) + "-" + this.day1.substr(3, 2) + "-" + this.day1.substr(0, 2);
      let maxDate = this.day2.substr(6, 4) + "-" + this.day2.substr(3, 2) + "-" + this.day2.substr(0, 2);

      this.globalVars.setValue("day1", minDate);
      this.globalVars.setValue("day2", maxDate);

      if (!this.daySelected) {
        let day2Date = new Date(res.data[1].id.substr(6, 4) + "-" + res.data[1].id.substr(3, 2) + "-" + res.data[1].id.substr(0, 2));
        this.daySelected = moment(Date.now()).isSame(day2Date, "day") ? this.day2 : this.day1;
      }

      this.meetingService.getMeetings(userId, "MySchedule").subscribe(response => {
        if (refresher)
          refresher.complete();
        // console.log("Meeting:", JSON.stringify(data));
        if (response.result === "OK") {
          this.schedules = response.data;
          // response.data.forEach(itm => {
          //   this.schedules.push(this.meetingService.buildMeeting(itm));
          // });
        } else {
          this.alertUser("Retrieve My Schedule data failed.", response.messsage);
        }

      }, err => {
        if (refresher)
          refresher.complete();

        this.schedules = [];
        console.log("Error", err);
        this.alertUser("Retrieve My Schedule data failed.", err);
      });
    }, error => {
      if (refresher)
        refresher.complete();

      this.schedules = [];
      console.log("Error", error);
      this.alertUser("Retrieve My Schedule data failed.", error);
    });
  }


  /**
   * Get meeting invitations of logged user
   */
  getMeetingInvitaions(refresher?: any) {
    this.fullInvitations = [];
    let userId: string = this.globalVars.getValue("userData").id;
    this.meetingService.getMeetings(userId, "Invitations").subscribe(response => {
      if (refresher)
        refresher.complete();
      if (response.result === "OK") {
        // response.data.forEach(itm => {
        //   if (itm.type === "meeting") {
        //     this.fullInvitations.push(this.meetingService.buildMeeting(itm));
        //   }
        // });
        this.fullInvitations = response.data;
        this.invitations = this.fullInvitations.slice();
      } else {
        this.alertUser("Retrieve Invitations data failed.", response.messsage);
      }
    }, error => {
      if (refresher)
        refresher.complete();
      this.fullInvitations = [];
      console.log("Error", error);
      this.alertUser("Retrieve Invitations data failed.", error);
    });
  }

  /**
   * Get Sent meetings of logged user
   */
  getSentMeetings(refresher?: any) {
    this.fullHostings = [];
    let userId: string = this.globalVars.getValue("userData").id;
    this.meetingService.getMeetings(userId, "Sent").subscribe(response => {
      if (refresher)
        refresher.complete();
      if (response.result === "OK") {
        this.fullHostings = response.data;
        this.hostings = this.fullHostings.slice();
      } else {
        this.alertUser("Retrieve Sent data failed.", response.messsage);
      }
    }, error => {
      if (refresher)
        refresher.complete();
      this.fullHostings = [];
      console.log("Error", error);
      this.alertUser("Retrieve Sent data failed.", error);
    });
  }



  syncToPhone(event: any) {
    if (Calendar.hasReadWritePermission) {
      this.syncCalendarToPhone();
    }
    else {
      Calendar.requestReadWritePermission().then(value => {
        this.syncCalendarToPhone();
      }).catch(reason => {
        this.alertUser("Failed to sync", reason.message);
      });
    }
  }

  syncCalendarToPhone() {
    // delete all existing IPI calendar
    Calendar.findEventWithOptions("", "", "", new Date(), new Date(), {}).then(value => {

      Calendar.deleteEvent("", "", "", new Date(), new Date()).then(value => {
        Calendar.createEventWithOptions("", "", "", new Date(), new Date(), {});
      }).catch(reason => {

      });
    }).catch(reason => {

    });
  }


  /**
   * View Meeting Details
   */
  viewMeetingDetails(data: any, type: string) {
    event.stopPropagation();
    event.preventDefault();
    if (data.isBlockTime) {
      // Open blocking detail
      console.log("Open blocktime detail.");
      let blockTime = this.navCtrl.getViews().find(itm => itm.name === "BlockTimePage") || BlockTimePage;
      this.navCtrl.push(blockTime, { blockTime: data }, { animate: true });
    } else {
      // console.log("View meeting details.");
      let meetingDetails = this.navCtrl.getViews().find(itm => itm.name === "MeetingDetailsPage") || MeetingDetailsPage;
      this.navCtrl.push(meetingDetails, { meetingData: data, type: type }, { animate: true });
    }
  }
  /**
   * Filter meeting invitations
   */
  filterInvitations(event: any) {
    let value: string = event.target.value;
    this.filterInvitation = value || "";
    // if the value is an empty string don't do filtering
    if (value && value.trim() != "") {
      this.invitations = this.fullInvitations.filter((itm) => {
        return (itm.subject.toLowerCase().indexOf(value.toLowerCase()) > -1 ||
          itm.meetingLocation.toLowerCase().indexOf(value.toLowerCase()) > -1 ||
          itm.timeDisplay.toLowerCase().indexOf(value.toLowerCase()) > -1 ||
          itm.userDisplayName.toLowerCase().indexOf(value.toLowerCase()) > -1 ||
          itm.date.toLowerCase().indexOf(value.toLowerCase()) > -1
        );
      }).slice();
    } else {
      this.invitations = this.fullInvitations.slice();
    }
  }


  /**
   * Filter Hosted meetings
   */
  filterHostings(event: any) {
    let value: string = event.target.value;
    this.filterHosting = value || "";
    // if the value is an empty string don't do filtering
    if (value && value.trim() != "") {
      this.hostings = this.fullHostings.filter((itm) => {
        return (itm.subject.toLowerCase().indexOf(value.toLowerCase()) > -1 ||
          itm.meetingLocation.toLowerCase().indexOf(value.toLowerCase()) > -1 ||
          itm.timeDisplay.toLowerCase().indexOf(value.toLowerCase()) > -1 ||
          itm.userDisplayName.toLowerCase().indexOf(value.toLowerCase()) > -1 ||
          itm.date.toLowerCase().indexOf(value.toLowerCase()) > -1
        );
      }).slice();
    } else {
      this.hostings = this.fullHostings.slice();
    }
  }

  refreshData(refresher: any) {
    switch (this.section) {
      case "Invitations": {
        this.getMeetingInvitaions(refresher);
        break;
      }
      case "Sent": {
        this.getSentMeetings(refresher);
        break;
      }
      default: {
        this.getMeetingSchedule(refresher);
        break;
      }
    }
  }


  /**
   * checkSchedule
   */
  checkSchedule(event: Event) {
    // console.log("Check Schedule:", eventData);
    event.stopPropagation();
  }

  scanQrCode() {

    // get person data
    // this is for testing only
    this.authService.getProfile("3829203a-4acf-6092-98b9-ff00006fb7ad").subscribe(response => {
      if (response.result === "OK") {
        let page = this.navCtrl.getViews().find(itm => itm.name === "ScanBadgePage") || ScanBadgePage;
        this.navCtrl.push(page, { profile: response.user }, { animate: true });
      } else {
        let alert = this.alertCtrl.create({
          title: "Failed to get profile",
          subTitle: response.message,
          buttons: ['OK']
        });
        alert.present();
      }
    });

    // BarcodeScanner.scan().then((barcodeData) => {
    //   if (!barcodeData.cancelled) {
    //     // console.log("Barcode:", barcodeData);
    //     let personId = barcodeData.text;
    //     // get person data
    //     this.authService.getProfile(personId).subscribe(response => {
    //       if (response.result === "OK") {
    //         let page = this.navCtrl.getViews().find(itm => itm.name === "ScanBadgePage") || ScanBadgePage;
    //         this.navCtrl.push(page, { profile: response.profile }, { animate: true });
    //       } else {
    //         this.alertUser("Failed to get profile.", response.message);
    //       }
    //     }, error => {
    //       this.alertUser("Failed to get profile.", error);
    //     });
    //   }
    // }, (err) => {
    //   console.log("Error:", err);
    //   this.alertUser("Scan failed.", err);
    // });
  }

  /**
   * remove appropriate invitation
   */
  private removeInvitaion(meeting: any) {
    let index = this.invitations.indexOf(meeting);
    if (index > -1) {
      this.invitations.splice(index, 1);
    }
    index = this.fullInvitations.indexOf(meeting);
    if (index > -1) {
      this.fullInvitations.splice(index, 1);
    }
  }
  /**
   * remove appropriate schedule
   */
  private removeSchedule(meeting: any) {
    let index = this.schedules.indexOf(meeting);
    if (index > -1) {
      this.schedules.splice(index, 1);
    }
  }
  /**
   * remove appropriate hosting
   */
  private removeHosting(meeting: any) {
    let index = this.hostings.indexOf(meeting);
    if (index > -1) {
      this.hostings.splice(index, 1);
    }
    index = this.fullHostings.indexOf(meeting);
    if (index > -1) {
      this.fullHostings.splice(index, 1);
    }
  }

  segmentChange() {
    // scroll to the bottom
    this.content.scrollToTop(250);
  }

  /**
   * Date Format Helper
   */
  getDateFormated(value: string, format: string): string {
    // API format date is DD-MM-YYYY
    // Change it to YYYY-MM-DD
    if (!value) return "";
    let dateValue: string = `${value.substr(6, 4)}-${value.substr(3, 2)}-${value.substr(0, 2)}`;
    return moment(dateValue).format(format);
  }


  alertUser(title: string, message: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: "bottom"
    });
    toast.present();
  }
}
