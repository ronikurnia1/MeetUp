import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as moment from "moment";


@Component({
  selector: 'page-send-comment',
  templateUrl: 'send-comment.html'
})
export class SendCommentPage {

  private meeting: any;
  private comment: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.meeting = navParams.get("meetingData");
    console.log("meeting", this.meeting);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SendCommentPage');
  }


  /**
  * Date Format Helper
  */
  getDateFormated(value: string, format: string): string {
    if (value === "All dates") return "All Dates";
    return moment(value).format(format);
  }

}
