import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import * as moment from "moment";
import { MeetingDetailsPage } from "../meeting-details/meeting-details";
import { MeetingService } from "../../providers/meeting-service";

@Component({
  selector: 'page-meeting-tracker',
  templateUrl: 'meeting-tracker.html'
})
export class MeetingTrackerPage {

  public availableMeetingDates = [
    { value: "All dates" },
    { value: "2016-01-10" },
    { value: "2016-01-11" },
    { value: "2016-01-13" },
    { value: "2016-01-14" },
    { value: "2016-01-15" },
    { value: "2016-01-17" }
  ];

  public meetingTracker = {
    leads: 12,
    sent: 9,
    invited: 7,
    meetings: [
      {
        subject: "Meeting Subject A",
        rate: 2.5,
        meetWith: {
          fullName: "David Wezilsky",
          title: "Mr.", company: "DigiLight Inc.", country: "USA",
          avatar: "assets/icon/avatar.png"
        }
      },
      {
        subject: "Meeting Subject B",
        rate: 3.5,
        meetWith: {
          fullName: "Mellani Lee",
          title: "Mrs.", company: "DataSwift Corp.", country: "USA",
          avatar: "assets/icon/avatar.png"
        }
      },
      {
        subject: "Meeting Subject D",
        rate: 0,
        meetWith: {
          fullName: "Jonas Brozikov",
          title: "Mr.", company: "Vision Bits AB", country: "Sweden",
          avatar: "assets/icon/avatar.png"
        }
      },
      {
        subject: "Meeting Subject E",
        rate: 4,
        meetWith: {
          fullName: "Michael Marlon",
          title: "Mr.", company: "MapByte Pte Ltd.", country: "Singapore",
          avatar: "assets/icon/avatar.png"
        }
      },
    ]
  };

  public selectOptions = { title: "Select Meeting Date" };
  public meetingDate: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private meetingService: MeetingService) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MeetingTrackerPage');
  }


  viewMeetingDetail(meeting: any) {
    event.stopPropagation();
    event.preventDefault();
    //let profilePage = this.navCtrl.getViews().find(itm => itm.name === "MeetingDetailsPage") || MeetingDetailsPage;
    // get meeting details
    this.meetingService.getMeetingById(meeting.id).subscribe(response => {
      if (response.result === "OK") {
        this.navCtrl.push(MeetingDetailsPage, { meetingData: response.data, type: "tracker" });
      } else {
        this.alertUser("Retrieve Meeting data failed.", response.message);
      }
    });
  }


  /**
  * Date Format Helper
  */
  getDateFormated(value: string, format: string): string {
    if (value === "All dates") return "All Dates";
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


}
