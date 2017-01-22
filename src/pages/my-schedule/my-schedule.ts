import { Component, NgZone } from "@angular/core";
import {
  App, NavController, NavParams, ToastController,
  Events, Tabs, AlertController, PopoverController,
  Platform
} from "ionic-angular";
import * as moment from "moment";
import { Meeting } from "../../domain/meeting";
import { MeetingService } from "../../providers/meeting-service";
import { GlobalVarsService } from "../../providers/global-vars-service";
import { MeetingDetailsPage } from "../meeting-details/meeting-details";
import { MeetingTrackerPage } from "../meeting-tracker/meeting-tracker";
import { CalendarViewPage } from "../calendar-view/calendar-view";
import { CancelOrDeclinePage } from "../cancel-or-decline/cancel-or-decline";
import { RescheduleMeetingPage } from "../reschedule-meeting/reschedule-meeting";
import { BlockTimePage } from "../block-time/block-time";
import { PickUserPage } from "../pick-user/pick-user";
import { BarcodeScanner } from "ionic-native";
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
  private withdrawMeetingSuccess: string = "meeting:withdrawMeetingSuccess";

  private tabs: Tabs;
  private showScanBadge: boolean = false;

  public section: string = "My Schedule";

  public scheduleDate: string;
  public totalMeeting: string;

  public schedules: Array<Meeting> = [];
  public invitations: Array<Meeting> = [];
  public hostings: Array<Meeting> = [];

  public fullInvitations: Array<Meeting> = [];
  public fullHostings: Array<Meeting> = [];

  public filterInvitation: string = "";
  public filterHosting: string = "";

  private statusFilter: string = "All";
  private filterStatusMenu: "menu:filterStatus"


  private statusFilters = [
    { title: "All", param: "all", eventName: this.filterStatusMenu },
    { title: "Pending", param: "pending", eventName: this.filterStatusMenu },
    { title: "Confirmed", param: "confirmed", eventName: this.filterStatusMenu },
    { title: "Cancelled", param: "cancelled", eventName: this.filterStatusMenu }
  ];


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
    events.subscribe(this.acceptInvitationSuccess, (meetingData: Meeting) => {
      // remove appropriate invitaion
      this.removeInvitaion(meetingData);
    });
    // Subscribe to the event published by CancelOrDeclinePage
    events.subscribe(this.declineInvitaionSuccess, (meetingData: Meeting) => {
      // remove appropriate invitaion
      this.removeInvitaion(meetingData);
    });
    // Subscribe to the event published by CancelOrDeclinePage
    events.subscribe(this.cancelMeetingSuccess, (meetingData: Meeting) => {
      // remove appropriate hosting
      this.removeHosting(meetingData);
    });
    // Subscribe to the event published by CancelOrDeclinePage
    events.subscribe(this.withdrawMeetingSuccess, (meetingData: Meeting) => {
      // remove appropriate schedule
      this.removeSchedule(meetingData);
    });

    // subscribe to the PopoverPage
    events.subscribe(this.filterStatusMenu, (menu) => {
      //console.log("menu", menu);
      this.handleFilter(menu);
    });

  }

  handleFilter(menu: any) {
    this.statusFilter = menu.title;
    console.log("active filter:", menu.param);
  }

  // segmentChange(event: any) {
  //   console.log("event:", event);
  //   this.section = event.value;
  // }

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
    // console.log("user type:", userType);
    // this.showScanBadge = userType.toLowerCase() === "exhibitor" || userType.toLowerCase() === "speaker";
    // console.log("show scan:", this.showScanBadge);
    this.zone.run(() => {
      this.showScanBadge = userType.toLowerCase() === "exhibitor" || userType.toLowerCase() === "speaker";
      console.log("show scan:", this.showScanBadge);
    });
  }

  ionViewWillUnload() {
    // unsubscribe events
    console.log("Unsubscribing");
    this.events.unsubscribe(this.acceptInvitationSuccess);
    this.events.unsubscribe(this.declineInvitaionSuccess);
    this.events.unsubscribe(this.cancelMeetingSuccess);
    this.events.unsubscribe(this.withdrawMeetingSuccess);
    this.events.unsubscribe(this.filterStatusMenu);
  }

  cancelMeeting(data: Meeting) {
    event.stopPropagation();
    event.preventDefault();
    console.log("Cancel Meeting.");
    let cancelDecline = this.navCtrl.getViews().find(itm => itm.name === "CancelOrDeclinePage");
    if (cancelDecline) {
      this.navCtrl.push(cancelDecline, { meetingData: data, type: "cancel" });
    } else {
      this.navCtrl.push(CancelOrDeclinePage, { meetingData: data, type: "cancel" });
    }
  }

  withdrawAcceptedMeeting(data: Meeting) {
    event.stopPropagation();
    event.preventDefault();
    console.log("Withdraw Meeting.");
    let cancelDecline = this.navCtrl.getViews().find(itm => itm.name === "CancelOrDeclinePage");
    if (cancelDecline) {
      this.navCtrl.push(cancelDecline, { meetingData: data, type: "withdraw" });
    } else {
      this.navCtrl.push(CancelOrDeclinePage, { meetingData: data, type: "withdraw" });
    }
  }
  rescheduleMeeting(data: Meeting) {
    event.stopPropagation();
    event.preventDefault();
    console.log("Reschedule Meeting.");
    let reschedule = this.navCtrl.getViews().find(itm => itm.name === "RescheduleMeetingPage");
    if (reschedule) {
      this.navCtrl.push(reschedule, { meetingData: data });
    } else {
      this.navCtrl.push(RescheduleMeetingPage, { meetingData: data });
    }
  }

  acceptMeeting(meeting: Meeting) {
    event.stopPropagation();
    event.preventDefault();
    console.log("Accept Meeting.");

    this.meetingService.acceptInvitation(meeting.id, this.globalVars.getValue("userData").email)
      .subscribe(response => {
        let message: string = "";
        // console.log("Response:", data);
        if (response.result === "OK") {
          message = "You have accepted the invitation.";
          // remove the invitaion
          setTimeout(() => {
            this.removeInvitaion(meeting);
          }, 2000);
        } else {
          message = response.message;
        }
        this.showToast(message);
      });
  }

  declineMeeting(data: Meeting) {
    event.stopPropagation();
    event.preventDefault();
    console.log("Decline Meeting.");
    let cancelDecline = this.navCtrl.getViews().find(itm => itm.name === "CancelOrDeclinePage");
    if (cancelDecline) {
      this.navCtrl.push(cancelDecline, { meetingData: data, type: "decline" });
    } else {
      this.navCtrl.push(CancelOrDeclinePage, { meetingData: data, type: "decline" });
    }
  }

  /**
 * Arrange Meeting
 */
  arrangeMeeting(eventData: Event) {
    event.stopPropagation();
    event.preventDefault();
    //check the user type
    let userType: string = this.globalVars.getValue("userData").userType;

    switch (userType.toLowerCase()) {
      case "admin":
      case "ipi staff":
      case "event organizer": {
        let arrangeMeeting = this.navCtrl.getViews().find(itm => itm.name === "AdminArrangeMeetingPage") || AdminArrangeMeetingPage;
        this.navCtrl.push(arrangeMeeting);
        break;
      }
      default: {
        let pickUser = this.navCtrl.getViews().find(itm => itm.name === "PickUserPage") || PickUserPage;
        this.navCtrl.push(pickUser);
        break;
      }
    }

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
    this.scheduleDate = moment().format("dddd, DD MMMM YYYY");
    // Get today's meeting schedule data
    this.getTodayMeetingSchedule();
    // Get invitaion
    this.getMeetingInvitaions();
    // Get hosting
    this.getHostedMeetings();
  }


  /**
   * Get today's meeting schedule of logged user
   */
  getTodayMeetingSchedule() {
    this.schedules = [];
    let userEmail: string = this.globalVars.getValue("userData").email;
    this.meetingService.getMeetings(userEmail, "my").subscribe(response => {
      // console.log("Meeting:", JSON.stringify(data));
      if (response.result === "OK") {
        response.data.forEach(itm => {
          this.schedules.push(this.meetingService.buildMeeting(itm));
        });
        let numberOfMeeting = this.schedules.filter(itm => itm.type === "meeting").length;
        this.totalMeeting = numberOfMeeting.toString();
        this.totalMeeting += numberOfMeeting > 1 ? " meetings" : " meeting";
      } else {
        this.alertUser("Retrieve My Schedule data failed.", response.messsage);
      }
    }, error => {
      this.schedules = [];
      console.log("Error", error);
      this.alertUser("Retrieve My Schedule data failed.", error);
    });
  }


  /**
   * Get meeting invitations of logged user
   */
  getMeetingInvitaions() {
    this.fullInvitations = [];
    let userEmail: string = this.globalVars.getValue("userData").email;
    this.meetingService.getMeetings(userEmail, "invited").subscribe(response => {
      if (response.result === "OK") {
        response.data.forEach(itm => {
          if (itm.type === "meeting") {
            this.fullInvitations.push(this.meetingService.buildMeeting(itm));
          }
        });
        this.invitations = this.fullInvitations.slice();
      } else {
        this.alertUser("Retrieve Invitations data failed.", response.messsage);
      }
    }, error => {
      this.fullInvitations = [];
      console.log("Error", error);
      this.alertUser("Retrieve Invitations data failed.", error);
    });
  }

  /**
   * Get hosted meetings of logged user
   */
  getHostedMeetings() {
    this.fullHostings = [];
    let userEmail: string = this.globalVars.getValue("userData").email;
    this.meetingService.getMeetings(userEmail, "hosting").subscribe(response => {
      if (response.result === "OK") {
        response.data.forEach(itm => {
          if (itm.type === "meeting") {
            this.fullHostings.push(this.meetingService.buildMeeting(itm));
          }
        });
        this.hostings = this.fullHostings.slice();
      } else {
        this.alertUser("Retrieve Sent data failed.", response.messsage);
      }
    }, error => {
      this.fullHostings = [];
      console.log("Error", error);
      this.alertUser("Retrieve Sent data failed.", error);
    });
  }

  /**
   * Open Meeting Tracker
   */
  openMeetingTracker(eventData: Events) {
    event.stopPropagation();
    event.preventDefault();
    //console.log("Open Meeting Tracker.");
    let meetingTracker = this.navCtrl.getViews().find(itm => itm.name === "MeetingTrackerPage");
    if (meetingTracker) {
      console.log("Meeting Tracker exists.");
      this.navCtrl.push(meetingTracker);
    } else {
      console.log("Load new Meeting Tracker.");
      this.navCtrl.push(MeetingTrackerPage);
    }
  }

  /**
   * View Meeting Details (Invitation or Hosted)
   */
  viewMeetingDetails(data: Meeting, type: string) {
    event.stopPropagation();
    event.preventDefault();
    if (data.type === "meeting") {
      // console.log("View meeting details.");
      let meetingDetails = this.navCtrl.getViews().find(itm => itm.name === "MeetingDetailsPage") || MeetingDetailsPage;
      this.navCtrl.push(meetingDetails, { meetingData: data, type: type }, { animate: true });
    } else {
      // Open blocking detail
      console.log("Open blocktime detail.");
      let blockTime = this.navCtrl.getViews().find(itm => itm.name === "BlockTimePage") || BlockTimePage;
      this.navCtrl.push(blockTime, { blockTime: data }, { animate: true });
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
          itm.location.toLowerCase().indexOf(value.toLowerCase()) > -1 ||
          itm.time.toLowerCase().indexOf(value.toLowerCase()) > -1 ||
          itm.meetingWith.fullName.toLowerCase().indexOf(value.toLowerCase()) > -1 ||
          itm.remarks.toLowerCase().indexOf(value.toLowerCase()) > -1
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
          itm.location.toLowerCase().indexOf(value.toLowerCase()) > -1 ||
          itm.time.toLowerCase().indexOf(value.toLowerCase()) > -1 ||
          itm.meetingWith.fullName.toLowerCase().indexOf(value.toLowerCase()) > -1 ||
          itm.remarks.toLowerCase().indexOf(value.toLowerCase()) > -1
        );
      }).slice();
    } else {
      this.hostings = this.fullHostings.slice();
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

    // // get person data
    // // this is for testing only
    // this.authService.getProfile("").subscribe(response => {
    //   if (response.result === "OK") {
    //     let page = this.navCtrl.getViews().find(itm => itm.name === "ScanBadgePage") || ScanBadgePage;
    //     this.navCtrl.push(page, { profile: response.profile }, { animate: true });
    //   } else {
    //     let alert = this.alertCtrl.create({
    //       title: "Failed to get profile",
    //       subTitle: response.message,
    //       buttons: ['OK']
    //     });
    //     alert.present();
    //   }
    // });

    BarcodeScanner.scan().then((barcodeData) => {
      if (!barcodeData.cancelled) {
        // console.log("Barcode:", barcodeData);
        let personId = barcodeData.text;
        // get person data
        this.authService.getProfile(personId).subscribe(response => {
          if (response.result === "OK") {
            let page = this.navCtrl.getViews().find(itm => itm.name === "ScanBadgePage") || ScanBadgePage;
            this.navCtrl.push(page, { profile: response.profile }, { animate: true });
          } else {
            this.alertUser("Failed to get profile.", response.message);
          }
        });
      }
    }, (err) => {
      console.log("Error:", err);
      this.alertUser("Scan failed.", err);
    });
  }

  /**
   * remove appropriate invitation
   */
  private removeInvitaion(meeting: Meeting) {
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
  private removeSchedule(meeting: Meeting) {
    let index = this.schedules.indexOf(meeting);
    if (index > -1) {
      this.schedules.splice(index, 1);
    }
  }
  /**
   * remove appropriate hosting
   */
  private removeHosting(meeting: Meeting) {
    let index = this.hostings.indexOf(meeting);
    if (index > -1) {
      this.hostings.splice(index, 1);
    }
    index = this.fullHostings.indexOf(meeting);
    if (index > -1) {
      this.fullHostings.splice(index, 1);
    }
  }

  /**
   * Date Format Helper
   */
  getDateFormated(value: Date, format: string): string {
    return moment(value).format(format);
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
