import { Component, ViewChild } from "@angular/core";
import { NavController, Tabs, Events } from "ionic-angular";
import { MySchedulePage } from "../my-schedule/my-schedule";
import { NotificationPage } from "../notification/notification";
import { ChatPage } from "../chat/chat";
import { MenuPage } from "../menu/menu";

@Component({
  templateUrl: "tabs.html"
})
export class TabsPage {
  private selectedTabEvent: string = "app:selectTabEvent";

  mySchedulePage = MySchedulePage;
  notificationPage = NotificationPage;
  chatPage = ChatPage;
  menuPage = MenuPage;

  constructor(private navCtrl: NavController,
    private events: Events) {
    // default index

    // Subscribe to the event published by PushService
    events.subscribe(this.selectedTabEvent, (tabIndex: number) => {
      this.selectTab(tabIndex);
    });

  }

  reloadRootPage(index: number, page: any) {
    // overides to reload rootPage
    let tabs: Tabs = this.navCtrl.getActiveChildNav();
    // console.log("Root:", tabs.getByIndex(index).getViews().find(itm => itm.name === page.name));
    let pageToLoad = tabs.getByIndex(index).getViews().find(itm => itm.name === page.name) || page;
    tabs.getByIndex(index).setRoot(pageToLoad, null, { animate: true });
    if (pageToLoad.instance.content) {
      // scroll the content
      pageToLoad.instance.content.scrollToTop(250);
    }
  }

  selectTab(index: number) {
    let tabs: Tabs = this.navCtrl.getActiveChildNav();
    tabs.select(index);
  }

  ionViewWillUnload() {
    // unsubscribe events
    console.log("Tab Unsubscribing");
    this.events.unsubscribe(this.selectedTabEvent);
  }


}
