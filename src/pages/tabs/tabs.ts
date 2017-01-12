import { Component } from "@angular/core";
import { NavController, Tabs } from "ionic-angular";
import { MySchedulePage } from "../my-schedule/my-schedule";
import { NotificationPage } from "../notification/notification";
import { ChatPage } from "../chat/chat";
import { MenuPage } from "../menu/menu";

@Component({
  templateUrl: "tabs.html"
})
export class TabsPage {
  defaultPage = MySchedulePage;
  notificationPage = NotificationPage;
  chatPage = ChatPage;
  menuPage = MenuPage;

  constructor(private navCtrl: NavController) {
  }

  reloadRootPage(index: number, page: any) {
    // overides to reload rootPage
    let tabs: Tabs = this.navCtrl.getActiveChildNav();
    // console.log("Root:", tabs.getByIndex(index).getViews().find(itm => itm.name === page.name));
    let pageToLoad = tabs.getByIndex(index).getViews().find(itm => itm.name === page.name) || page;
    tabs.getByIndex(index).setRoot(pageToLoad, null, { animate: true });
  }

}
