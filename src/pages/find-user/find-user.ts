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

  private profiles: any = [];
  private keywords: string;
  private currentPageIndex: number;
  private infiniteScroll: any;

  constructor(private navCtrl: NavController,
    private navParams: NavParams,
    private alertCtrl: AlertController,
    private loadCtrl: LoadingController,
    private chatService: FirebaseChatService,
    private globalVars: GlobalVarsService,
    private meetingService: MeetingService) {
    this.profiles = [];
    this.keywords = "";
    this.currentPageIndex = 1;
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad FindUserPage");
    this.getUserForChat(this.keywords, true, this.currentPageIndex, undefined);
  }

  getUserForChat(keywords: string, withLoader: boolean, pageIndex: number, refresher?: any) {

    let loader: any;
    if (withLoader) {
      loader = this.loadCtrl.create({
        content: "Please wait..."
      });
      loader.present();
    }

    this.meetingService.getUsersForChat(keywords, pageIndex).subscribe((response) => {
      if (response.result === "OK") {
        response.users.forEach(user => {
          this.profiles.push(user);
        });
      } else {
        this.alertUser("Retrieve users failed.", response.message);
      }

      if (loader)
        loader.dismissAll();

      if (refresher)
        refresher.complete();

      if (this.infiniteScroll)
        this.infiniteScroll.complete();

    }, error => {

      if (loader)
        loader.dismissAll();

      if (refresher)
        refresher.complete();

      if (this.infiniteScroll)
        this.infiniteScroll.complete();

      this.alertUser("Retrive user data failed.", error);
    });
  }

  filterProfile(event: any) {
    let keywords: string = event.target.value || "";
    this.profiles = [];
    this.currentPageIndex = 1;
    this.getUserForChat(keywords, false, this.currentPageIndex, undefined);
  }

  refreshData(refresher: any) {
    this.profiles = [];
    this.currentPageIndex = 1;
    this.getUserForChat(this.keywords, true, this.currentPageIndex, refresher);
  }


  doInfinite(infiniteScroll: any) {
    this.infiniteScroll = infiniteScroll;
    this.currentPageIndex += 1;
    this.getUserForChat(this.keywords, false, this.currentPageIndex, undefined);
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
