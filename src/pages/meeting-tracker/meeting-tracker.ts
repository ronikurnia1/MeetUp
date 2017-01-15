import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as moment from "moment";
import { UserProfilePage } from "../user-profile/user-profile";

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
    invited: 12,
    hosted: 9,
    meets: 7,
    leads: 5,
    meetings: [
      {
        subject: "Meeting Subject A",
        rate: 2.5,
        meetingWith: {
          fullName: "David Wezilsky",
          title: "Mr.", company: "DigiLight Inc.", country: "USA",
          avatar: "assets/icon/avatar.png"
        }
      },
      {
        subject: "Meeting Subject B",
        rate: 3.5,
        meetingWith: {
          fullName: "Mellani Lee",
          title: "Mrs.", company: "DataSwift Corp.", country: "USA",
          avatar: "assets/icon/avatar.png"
        }
      },
      {
        subject: "Meeting Subject D",
        rate: 0,
        meetingWith: {
          fullName: "Jonas Brozikov",
          title: "Mr.", company: "Vision Bits AB", country: "Sweden",
          avatar: "assets/icon/avatar.png"
        }
      },
      {
        subject: "Meeting Subject E",
        rate: 4,
        meetingWith: {
          fullName: "Michael Marlon",
          title: "Mr.", company: "MapByte Pte Ltd.", country: "Singapore",
          avatar: "assets/icon/avatar.png"
        }
      },
    ]
  };

  public selectOptions = { title: "Select Meeting Date" };
  public meetingDate: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MeetingTrackerPage');
  }


  viewProfile(profile: any) {
    event.stopPropagation();
    event.preventDefault();
    let profilePage = this.navCtrl.getViews().find(itm => itm.name === "UserProfilePage") || UserProfilePage;
    this.navCtrl.push(profilePage, { profile: profile });
  }

  /**
 * Date Format Helper
 */
  getDateFormated(value: string, format: string): string {
    if (value === "All dates") return "All Dates";
    return moment(value).format(format);
  }


}
