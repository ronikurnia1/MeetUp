import { Component } from "@angular/core";
import { NavController, ViewController, Events } from "ionic-angular";

@Component({
  template: `
    <ion-list>
      <button *ngFor="let menu of menus" ion-item (click)="selectMenu(menu)">{{menu.title}}</button>
    </ion-list>
  `
})
export class PopoverPage {


  menus = [];

  constructor(public navCtrl: NavController,
    private viewCtrl: ViewController,
    private events: Events) {
    this.menus = viewCtrl.data;
  }

  selectMenu(menu: any) {
    this.viewCtrl.dismiss();
    this.events.publish(menu.eventName, menu);
  }
}