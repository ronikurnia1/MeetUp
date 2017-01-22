import { Component } from '@angular/core';
import * as moment from "moment";
import { NavController, NavParams } from 'ionic-angular';
import { MeetingService } from "../../providers/meeting-service";

@Component({
  selector: 'page-announcement-details',
  templateUrl: 'announcement-details.html'
})
export class AnnouncementDetailsPage {

  private message: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private meetingService: MeetingService) {

    this.message = this.navParams.get("message");
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad AnnouncementDetailsPage');
  }

  /**
   * Date Format Helper
   */
  getDateFormated(value: Date, format: string): string {
    return moment(value).format(format);
  }


}
