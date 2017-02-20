import { Component } from "@angular/core";
import { NavController, NavParams, ToastController, Events } from "ionic-angular";
import * as moment from "moment";
import { MeetingService } from "../../providers/meeting-service";
import { AuthService } from "../../providers/auth-service";
import { GlobalVarsService } from "../../providers/global-vars-service";
import { CancelOrDeclinePage } from "../cancel-or-decline/cancel-or-decline";
import { RescheduleMeetingPage } from "../reschedule-meeting/reschedule-meeting";
import { UserProfilePage } from "../user-profile/user-profile";


@Component({
  selector: "page-meeting-details",
  templateUrl: "meeting-details.html"
})
export class MeetingDetailsPage {
  public meeting: any;
  public type: string;

  // post meeting survey
  private meetingRate: string = "";
  private comment: string = "";
  private submitAttempt: boolean = false;
  private selectedComment: string = "";

  private commentTemplates = {
    text1: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    text2: "Curabitur ut auctor neque, et placerat nibh.",
    text3: "Morbi ac magna commodo, tristique arcu quis, varius lorem.",
    text4: "Vivamus pulvinar ante quam, et dapibus ante pharetra sit amet."
  }

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private meetingService: MeetingService,
    private authService: AuthService,
    private globalVars: GlobalVarsService,
    private toastCtrl: ToastController,
    private events: Events) {
    this.meeting = navParams.get("meetingData");
    console.log("meeting:", this.meeting);
    this.type = navParams.get("type");
  }

  viewProfile() {
    event.stopPropagation();
    event.preventDefault();
    let profilePage = this.navCtrl.getViews().find(itm => itm.name === "UserProfilePage") || UserProfilePage;
    // get profile 
    this.authService.getProfile(this.meeting.userId).subscribe(respose => {
      if (respose.result === "OK") {
        this.navCtrl.push(profilePage, { profile: respose.user });
      } else {
        this.showToast(respose.message);
      }
    }, error => {
      this.showToast(error);
    });
  }

  showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: "bottom"
    });
    toast.present();
  }


  acceptMeeting() {
    event.stopPropagation();
    event.preventDefault();

    this.meetingService.acceptInvitation(this.meeting.id, this.globalVars.getValue("userData"))
      .subscribe(response => {
        let message: string = "";
        // console.log("Response:", data);
        if (response.result === "OK") {
          message = "You have accepted the invitation.";
        } else {
          message = response.message;
        }
        let toast = this.toastCtrl.create({
          message: message,
          duration: 3000,
          position: "bottom"
        });
        toast.present().then(value => {
          // if accepting invitation success
          // then publish event to notify to remove item from invitation
          // and then get back to the previous page 
          if (response.result === "OK") {
            this.events.publish("meeting:acceptInvitationSuccess", this.meeting)
            this.navCtrl.pop();
          }
        });
      });
  }

  declineMeeting() {
    event.stopPropagation();
    event.preventDefault();
    let cancelDecline = this.navCtrl.getViews().find(itm => itm.name === "CancelOrDeclinePage") || CancelOrDeclinePage;
    this.navCtrl.push(cancelDecline, { meetingData: this.meeting, type: "decline" });
  }

  cancelMeeting() {
    event.stopPropagation();
    event.preventDefault();
    let cancelDecline = this.navCtrl.getViews().find(itm => itm.name === "CancelOrDeclinePage") || CancelOrDeclinePage;
    this.navCtrl.push(cancelDecline, { meetingData: this.meeting, type: "cancel" });
  }

  rescheduleMeeting() {
    event.stopPropagation();
    event.preventDefault();
    let reschedule = this.navCtrl.getViews().find(itm => itm.name === "RescheduleMeetingPage") || RescheduleMeetingPage;
    this.navCtrl.push(reschedule, { meetingData: this.meeting });
  }

  postMeetingSurvey() {
    event.stopPropagation();
    event.preventDefault();
    this.submitAttempt = true;
    if (this.comment.trim().length >= 2 && this.meetingRate.trim().length !== 0) {
      this.meetingService.portMeetingSurvey({
        meetingId: this.meeting.id,
        meetingRate: this.meetingRate,
        comment: this.comment
      }).subscribe(response => {
        let message: string = "";
        if (response.result === "OK") {
          message = "Feedback has been sent successfully.";
        } else {
          message = response.message;
        }
        let toast = this.toastCtrl.create({
          message: message,
          duration: 3000,
          position: "bottom"
        });
        toast.present().then(value => {
          // if accepting invitation success
          // then publish event to notify to remove item from invitation
          // and then get back to the previous page 
          if (response.result === "OK") {
            this.navCtrl.pop();
          }
        });
      });
    }
  }

  rateMeetingAs(value: string) {
    this.meetingRate = value;
    console.log("Rate:", value);
  }

  selectComment(value: string) {
    this.selectedComment = value;
    this.comment = this.commentTemplates[value];
  }

  ionViewDidLoad() {
    // console.log("ionViewDidLoad MeetingInvitationPage");
  }


  /**
   * Date Format Helper
   */
  getDateFormated(value: string, format: string): string {
    // API format date is DD-MM-YYYY
    // Change it to YYYY-MM-DD
    let dateValue: string = `${value.substr(6, 4)}-${value.substr(3, 2)}-${value.substr(0, 2)}`;
    return moment(dateValue).format(format);
  }

}
