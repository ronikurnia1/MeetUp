import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { GlobalVarsService } from "../../providers/global-vars-service";
import { MeetingService } from "../../providers/meeting-service";
import * as moment from "moment";
import { MeetingDetailsPage } from "../meeting-details/meeting-details";

@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html'
})
export class NotificationPage {
  private notifications: any[];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private globalVars: GlobalVarsService,
    private meetingService: MeetingService,
    private alertCtrl: AlertController) {
    this.getNotification();
  }


  viewDetails() {
    this.meetingService.getMeetingById("").subscribe(response => {
      if (response.result === "OK") {
        let meetingDetails = this.navCtrl.getViews().find(itm => itm.name === "MeetingDetailsPage") || MeetingDetailsPage;
        this.navCtrl.push(meetingDetails, { meetingData: response.data, type: "hosted" }, { animate: true });
      } else {
        this.alertUser("Retrieve meeting data failed.", response.messsage);
      }
    }, error => {
      this.alertUser("Retrieve meeting data failed.", error);
    });
  }

  /**
   * Get notification of logged user
   */
  getNotification() {
    this.notifications = [];
    let userEmail: string = this.globalVars.getValue("userData").email;
    this.meetingService.getNotifications(userEmail).subscribe(response => {
      // console.log("Meeting:", JSON.stringify(data));
      if (response.result === "OK") {
        this.notifications = response.data;
      } else {
        this.alertUser("Retrieve notifications data failed.", response.messsage);
      }
    }, error => {
      this.alertUser("Retrieve notifications data failed.", error);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationPage');
  }

  alertUser(title: string, message: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  /**
   * Date Format Helper
   */
  getDateFormated(value: Date): string {
    return moment(value).fromNow();
  }


}
