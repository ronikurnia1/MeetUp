import { Component } from '@angular/core';
import { NavController, Events, NavParams, AlertController } from 'ionic-angular';
import { GlobalVarsService } from "../../providers/global-vars-service";
import { MeetingService } from "../../providers/meeting-service";
import * as moment from "moment";
import { MeetingDetailsPage } from "../meeting-details/meeting-details";


// Notification next action:
// 1. Go to Detail Meeting screen (refresh: schedule, invitation)
// 2. Go to Announcement (Mesage) detail screen (refresh: Announcement)

@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html'
})
export class NotificationPage {
  private notifications: any[];
  private refreshNotifEvent: string = "app:refreshNotification";

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private events: Events,
    private globalVars: GlobalVarsService,
    private meetingService: MeetingService,
    private alertCtrl: AlertController) {
    this.getNotification();

    // Subscribe to the event published by PushService
    events.subscribe(this.refreshNotifEvent, () => {
      this.getNotification();
    });

  }


  viewDetails(notif: any) {
    let notifType = notif.type;
    switch (notifType) {
      case "meeting": {
        this.meetingService.getMeetingById("").subscribe(response => {
          if (response.result === "OK") {
            //TODO: check meetingId exist on invitation or my-schedule
            let type: string = "invitation";
            //let meetingDetails = this.navCtrl.getViews().find(itm => itm.name === "MeetingDetailsPage") || MeetingDetailsPage;
            this.navCtrl.push(MeetingDetailsPage, { meetingData: response.data, type: type }, { animate: true });

          } else {
            this.alertUser("Retrieve meeting data failed.", response.messsage);
          }
        }, error => {
          this.alertUser("Retrieve meeting data failed.", error);
        });
        break;
      }
      case "announcement": {
        //TODO: go to announcement details:

        break;
      }
      default: {
        break;
      }
    }


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
    // console.log('ionViewDidLoad NotificationPage');
  }

  ionViewWillUnload() {
    // unsubscribe events
    console.log("Notif Page Unsubscribing");
    this.events.unsubscribe(this.refreshNotifEvent);
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
