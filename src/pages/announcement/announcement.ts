import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import * as moment from "moment";
import { GlobalVarsService } from "../../providers/global-vars-service";
import { MeetingService } from "../../providers/meeting-service";
import { AnnouncementDetailsPage } from "../announcement-details/announcement-details";

@Component({
  selector: 'page-announcement',
  templateUrl: 'announcement.html'
})
export class AnnouncementPage {

  private messages = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private meetingService: MeetingService,
    private globalVars: GlobalVarsService,
    private alertCtrl: AlertController) {

    this.getMessageList();
  }

  viewMessage(message) {
    event.stopPropagation();
    event.preventDefault();

    this.meetingService.getMessageById(message.id).subscribe(response => {
      if (response.result === "OK") {
        let message = response.data;

        //let details = this.navCtrl.getViews().find(itm => itm.name === "AnnouncementDetailsPage") || AnnouncementDetailsPage;
        this.navCtrl.push(AnnouncementDetailsPage, { message: message }, { animate: true });
      } else {
        let alert = this.alertCtrl.create({
          title: "Cannot open Message Details",
          subTitle: response.message,
          buttons: ['OK']
        });
        alert.present();
      }
    });
  }

  /**
   * Get message list
   */
  getMessageList() {
    this.messages = [];
    this.meetingService.getMessageList().subscribe(response => {
      response.data.forEach(itm => this.messages.push(itm));
    });
  }

  ionViewWillEnter() {
    this.getMessageList();
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ChatPage');
  }


  /**
   * Date Format Helper
   */
  getDateFormated(value: Date, format: string): string {
    return moment(value).format(format);
  }

}
