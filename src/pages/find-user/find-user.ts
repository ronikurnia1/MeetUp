import { Component } from "@angular/core";
import { NavController, NavParams, Tabs } from "ionic-angular";
import { MeetingService } from "../../providers/meeting-service";
import { GlobalVarsService } from "../../providers/global-vars-service";
import { ChatDetailsPage } from "../chat-details/chat-details";
import { FirebaseChatService } from "../../providers/firebase-chat-service";

@Component({
  selector: "page-find-user",
  templateUrl: "find-user.html"
})
export class FindUserPage {

  private profiles: any[];
  private filterProfileValue: string = "";

  constructor(private navCtrl: NavController,
    private navParams: NavParams,
    private chatService: FirebaseChatService,
    private globalVars: GlobalVarsService,
    private meetingService: MeetingService) {

    this.meetingService.getUsers().subscribe((response) => {
      this.profiles = response.data;
    });
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad FindUserPage");
  }


  filterProfile(event: any) {
    this.filterProfileValue = event.target.value || "";
    this.profiles = [];
    this.meetingService.getUsers("all", this.filterProfileValue).subscribe((response) => {
      this.profiles = response.data;
    });
  }

  openChat(receiver: any) {
    event.stopPropagation();
    event.preventDefault();

    // close the current page
    this.navCtrl.pop({ animate: true }).then(value => {
      let tabs: Tabs = this.navCtrl.parent;
      let chatDetails: any = tabs.parent.getViews().find(itm => itm.name === "ChatDetailsPage") || ChatDetailsPage;
      tabs.parent.push(chatDetails, {
        sender: this.globalVars.getValue("userData"),
        receiver: receiver,
        chatId: undefined
      }, { animate: true });
    });

  }
}
