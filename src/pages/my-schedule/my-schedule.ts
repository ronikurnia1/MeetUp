import { Component } from "@angular/core";
import { App, NavController, NavParams, ToastController, Events, Tabs, AlertController } from "ionic-angular";
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

  public section: string = "my-schedule";

  public scheduleDate: string;
  public totalMeeting: string;

  public schedules: Array<Meeting> = [];
  public invitations: Array<Meeting> = [];
  public hostings: Array<Meeting> = [];

  public fullInvitations: Array<Meeting> = [];
  public fullHostings: Array<Meeting> = [];

  public filterInvitation: string = "";
  public filterHosting: string = "";

  constructor(
    public app: App,
    public navCtrl: NavController,
    public navParams: NavParams,
    private toastCtrl: ToastController,
    private meetingService: MeetingService,
    private globalVars: GlobalVarsService,
    private events: Events,
    private alertCtrl: AlertController,
    private authService: AuthService) {

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

    let userType: string = this.globalVars.getValue("userData").userType;
    console.log("user type:", userType);
    this.showScanBadge = userType.toLowerCase() === "exhibitor" || userType.toLowerCase() === "speaker";

  }

  ionViewDidLoad() {
    // console.log("ionViewDidLoad MySchedulePage");
  }

  ionViewWillUnload() {
    // unsubscribe events
    console.log("Unsubscribing");
    this.events.unsubscribe(this.acceptInvitationSuccess);
    this.events.unsubscribe(this.declineInvitaionSuccess);
    this.events.unsubscribe(this.cancelMeetingSuccess);
    this.events.unsubscribe(this.withdrawMeetingSuccess);
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
      .subscribe(data => {
        let message: string = "";
        // console.log("Response:", data);
        if (data.Result === "OK") {
          message = "You have accepted the invitation.";
          // remove the invitaion
          setTimeout(() => {
            this.removeInvitaion(meeting);
          }, 2000);
        } else {
          message = data.Message;
        }
        let toast = this.toastCtrl.create({
          message: message,
          duration: 3000,
          position: "bottom"
        });
        toast.present();
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
    // console.log("Arrange Meeting.");
    let pickUser = this.navCtrl.getViews().find(itm => itm.name === "PickUserPage") || PickUserPage;
    this.navCtrl.push(pickUser);
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
    this.meetingService.getMeetings(userEmail, "my").subscribe(data => {
      // console.log("Meeting:", JSON.stringify(data));
      data.forEach(itm => {
        this.schedules.push(this.meetingService.buildMeeting(itm));
      });
      let numberOfMeeting = this.schedules.filter(itm => itm.type === "meeting").length;
      this.totalMeeting = numberOfMeeting.toString();
      this.totalMeeting += numberOfMeeting > 1 ? " meetings" : " meeting";
    }, error => {
      this.schedules = [];
      console.log("Error", error);
    });
  }


  /**
   * Get meeting invitations of logged user
   */
  getMeetingInvitaions() {
    this.fullInvitations = [];
    let userEmail: string = this.globalVars.getValue("userData").email;
    this.meetingService.getMeetings(userEmail, "invited").subscribe(data => {
      data.forEach(itm => {
        if (itm.type === "meeting") {
          this.fullInvitations.push(this.meetingService.buildMeeting(itm));
        }
      });
      this.invitations = this.fullInvitations.slice();
    }, error => {
      this.fullInvitations = [];
      console.log("Error", error);
    });
  }

  /**
   * Get hosted meetings of logged user
   */
  getHostedMeetings() {
    this.fullHostings = [];
    let userEmail: string = this.globalVars.getValue("userData").email;
    this.meetingService.getMeetings(userEmail, "hosting").subscribe(data => {
      data.forEach(itm => {
        if (itm.type === "meeting") {
          this.fullHostings.push(this.meetingService.buildMeeting(itm));
        }
      });
      this.hostings = this.fullHostings.slice();
    }, error => {
      this.fullHostings = [];
      console.log("Error", error);
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
   * Toggle (expand/collapse) the meeting
   */
  toggleMeeting(data: Meeting) {
    event.stopPropagation();
    event.preventDefault();
    if (data.type === "meeting") {
      // this.schedules.forEach(itm => {
      //   if (itm.subject != data.subject) {
      //     itm.isExpanded = false;
      //   }
      // });
      data.isExpanded = !data.isExpanded;
    } else {
      // Open blocking detail
      console.log("Open blocktime detail.");
      let blockTime = this.navCtrl.getViews().find(itm => itm.name === "BlockTimePage") || BlockTimePage;
      this.navCtrl.push(blockTime, { blockTime: data }, { animate: true });
    }
  }

  /**
   * View Meeting Details (Invitation or Hosted)
   */
  viewMeetingDetails(data: Meeting, type: string) {
    event.stopPropagation();
    event.preventDefault();
    // console.log("View meeting details.");
    let meetingDetails = this.navCtrl.getViews().find(itm => itm.name === "MeetingDetailsPage") || MeetingDetailsPage;
    this.navCtrl.push(meetingDetails, { meetingData: data, type: type }, { animate: true });
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

    // get person data
    // this is for testing only
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
            let alert = this.alertCtrl.create({
              title: "Failed to get profile",
              subTitle: response.message,
              buttons: ['OK']
            });
            alert.present();
          }
        });
      }
    }, (err) => {
      console.log("Error:", err);
      let alert = this.alertCtrl.create({
        title: "Scan failed",
        subTitle: err,
        buttons: ['OK']
      });
      alert.present();
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

}