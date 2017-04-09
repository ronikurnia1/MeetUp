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
  private keywords: string;

  constructor(private navCtrl: NavController,
    private navParams: NavParams,
    private alertCtrl: AlertController,
    private loadCtrl: LoadingController,
    private chatService: FirebaseChatService,
    private globalVars: GlobalVarsService,
    private meetingService: MeetingService) {
    this.keywords = "";
    this.getUserForChat("", true, false, 1);
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad FindUserPage");
  }

  getUserForChat(keywords: string, withLoader: boolean, useLocalData: boolean, pageIndex: number, refresher?: any) {
    if (refresher)
      refresher.complete();

    let loader: any;
    if (withLoader) {
      loader = this.loadCtrl.create({
        content: "Please wait..."
      });
      loader.present();
    }

    this.meetingService.getUsersForChat(keywords, useLocalData, pageIndex).subscribe((response) => {
      if (loader)
        loader.dismissAll();
      if (response.result === "OK") {
        this.profiles = response.users;
      } else {
        this.alertUser("Retrieve users failed.", response.message);
      }
    }, error => {
      if (loader)
        loader.dismissAll();
      this.alertUser("Retrive user data failed.", error);
    });
  }


  filterProfile(event: any) {
    let keywords: string = event.target.value || "";
    this.profiles = [];
    this.getUserForChat(keywords, false, false, 1);
  }

  refreshData(refresher: any) {
    this.getUserForChat(this.keywords, true, false, 3, refresher);
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
