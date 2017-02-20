import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, Events } from "ionic-angular";
import { Meeting } from "../../domain/meeting";
import * as moment from "moment";
import { MeetingService } from "../../providers/meeting-service";
import { GlobalVarsService } from "../../providers/global-vars-service";

@Component({
  selector: 'page-cancel-or-decline',
  templateUrl: 'cancel-or-decline.html'
})
export class CancelOrDeclinePage {
  private title: string;
  public meeting: Meeting;
  public reason: string = "";
  private cancelationType: string;
  private submitAttempt: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private meetingService: MeetingService,
    private globalVars: GlobalVarsService,
    private toastCtrl: ToastController,
    private events: Events) {
    this.meeting = navParams.get("meetingData");
    this.cancelationType = navParams.get("type");
    this.title = this.cancelationType.toLowerCase() === "decline" ? "Decline" : "Cancelation";
  }

  declineInvitation() {
    event.stopPropagation();
    event.preventDefault();
    console.log("Decline Invitation.");
    this.submitAttempt = true;
    if (this.reason.trim().length === 0) return;
    this.meetingService.declineInvitation(this.meeting.id, this.globalVars.getValue("userData").email, this.reason)
      .subscribe(response => {
        let message: string = "";
        // console.log("Response:", data);
        if (response.result === "OK") {
          message = "You have declined the invitation.";
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
            this.events.publish("meeting:declineInvitationSuccess", this.meeting)
            this.navCtrl.pop().then(data => {
              // Close if Meeting Details page are openned
              let meetingDetails = this.navCtrl.getViews().find(itm => itm.name === "MeetingDetailsPage");
              if (meetingDetails) {
                this.navCtrl.pop();
              }
            });
          }
        });
      });
  }

  withdrawAcceptedMeeting() {
    event.stopPropagation();
    event.preventDefault();
    console.log("Withdraw Meeting.");
    this.submitAttempt = true;
    if (this.reason.trim().length === 0) return;
    this.meetingService.withdrawAcceptedMeeting(this.meeting.id, this.globalVars.getValue("userData").email, this.reason)
      .subscribe(response => {
        let message: string = "";
        // console.log("Response:", data);
        if (response.result === "OK") {
          message = "You have canceled the meeting.";
        } else {
          message = response.message;
        }
        let toast = this.toastCtrl.create({
          message: message,
          duration: 3000,
          position: "bottom"
        });
        toast.present().then(value => {
          // then publish event to notify to remove item from schedule
          // and then get back to the previous page 
          if (response.result === "OK") {
            this.events.publish("meeting:withdrawMeetingSuccess", this.meeting)
            this.navCtrl.pop();
          }
        });
      });
  }

  cancelMeeting() {
    event.stopPropagation();
    event.preventDefault();
    console.log("Cancel Meeting.");
    this.submitAttempt = true;
    if (this.reason.trim().length === 0) return;
    this.meetingService.cancelMeeting(this.meeting.id, this.reason)
      .subscribe(response => {
        let message: string = "";
        // console.log("Response:", data);
        if (response.result === "OK") {
          message = "You have canceled the meeting.";
        } else {
          message = response.message;
        }
        let toast = this.toastCtrl.create({
          message: message,
          duration: 3000,
          position: "bottom"
        });
        toast.present().then(value => {
          // if canel meeting success
          // then publish event to notify to remove item from hosting
          // and then get back to the previous page 
          if (response.result === "OK") {
            this.events.publish("meeting:cancelMeetingSuccess", this.meeting)
            this.navCtrl.pop().then(data => {
              // Close if Meeting Details page are openned
              let meetingDetails = this.navCtrl.getViews().find(itm => itm.name === "MeetingDetailsPage");
              if (meetingDetails) {
                this.navCtrl.pop();
              }
            });
          }
        });
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DeclinePage');
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
