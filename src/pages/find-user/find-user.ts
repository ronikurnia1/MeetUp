import { Component } from "@angular/core";
import { NavController, LoadingController, NavParams, Tabs, AlertController } from "ionic-angular";
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

  constructor(private navCtrl: NavController,
    private navParams: NavParams,
    private alertCtrl: AlertController,
    private loadCtrl: LoadingController,
    private chatService: FirebaseChatService,
    private globalVars: GlobalVarsService,
    private meetingService: MeetingService) {

    this.getUserForChat("", "", "");
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad FindUserPage");
  }

  getUserForChat(userTypeId: string, industryId: string, keywords: string) {
    let loader = this.loadCtrl.create({
      content: "Please wait..."
    });
    loader.present();

    this.meetingService.getUsersForChat(userTypeId, industryId, keywords).subscribe((response) => {
      this.profiles = response.users;
      loader.dismissAll();
    }, error => {
      loader.dismissAll();
      this.alertUser("Retrive user data failed.", error);
    });

  }


  filterProfile(event: any) {
    let keywords: string = event.target.value || "";
    this.profiles = [];
    this.getUserForChat("", "", keywords);
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

  alertUser(title: string, message: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }


}
