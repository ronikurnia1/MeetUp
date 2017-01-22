import { Component } from "@angular/core";
import { NavController, NavParams, Tabs } from "ionic-angular";
import { MeetingService } from "../../providers/meeting-service";
import { ChatDetailsPage } from "../chat-details/chat-details";

@Component({
  selector: "page-find-user",
  templateUrl: "find-user.html"
})
export class FindUserPage {

  private profiles: any[];
  private filterProfileValue: string = "";

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private meetingService: MeetingService) {

    this.meetingService.getUsers().subscribe((response) => {
      this.profiles = response;
    });
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad FindUserPage");
  }

  openChat(profile: any) {
    event.stopPropagation();
    event.preventDefault();
    // let chatDetails = this.navCtrl.getViews().find(itm => itm.name === "ChatDetailsPage") || ChatDetailsPage;
    // get chat details
    // this.meetingService.getMeetingById(meeting.id).subscribe(response => {
    // this.navCtrl.push(chatDetails, { meetingData: response });
    // });

    // close the current page
    this.navCtrl.pop({ animate: true }).then(value => {
      let tabs: Tabs = this.navCtrl.parent;
      let chatDetails: any = tabs.parent.getViews().find(itm => itm.name === "ChatDetailsPage");
      if (chatDetails) {
        console.log("Exist");
      } else {
        chatDetails = ChatDetailsPage;
      }
      tabs.parent.push(chatDetails, { profile: profile }, { animate: true });
    });
  }
}
