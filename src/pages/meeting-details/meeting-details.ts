import { Component } from "@angular/core";
import { NavController, NavParams, ToastController, Events } from "ionic-angular";
import { Meeting } from "../../domain/meeting";
import * as moment from "moment";
import { MeetingService } from "../../providers/meeting-service";
import { GlobalVarsService } from "../../providers/global-vars-service";
import { CancelOrDeclinePage } from "../cancel-or-decline/cancel-or-decline";
import { RescheduleMeetingPage } from "../reschedule-meeting/reschedule-meeting";
import { UserProfilePage } from "../user-profile/user-profile";
import { PostMeetingSurveyPage } from "../post-meeting-survey/post-meeting-survey";

@Component({
  selector: "page-meeting-details",
  templateUrl: "meeting-details.html"
})
export class MeetingDetailsPage {
  public meeting: Meeting;
  public type: string;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private meetingService: MeetingService,
    private globalVars: GlobalVarsService,
    private toastCtrl: ToastController,
    private events: Events) {
    this.meeting = navParams.get("meetingData");
    this.type = navParams.get("type");
  }

  viewProfile() {
    event.stopPropagation();
    event.preventDefault();
    let profilePage = this.navCtrl.getViews().find(itm => itm.name === "UserProfilePage") || UserProfilePage;
    this.navCtrl.push(profilePage, { profile: this.meeting.meetingWith });
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

  postMeetingSurvey(meetingId: string) {
    event.stopPropagation();
    event.preventDefault();
    let survey = this.navCtrl.getViews().find(itm => itm.name === "PostMeetingSurveyPage") || PostMeetingSurveyPage;
    this.navCtrl.push(survey, { meetingId: meetingId });
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad MeetingInvitationPage");
  }


  /**
   * Date Format Helper
   */
  getDateFormated(value: Date, format: string): string {
    return moment(value).format(format);
  }

}
