import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
import { Platform } from "ionic-angular";
import { Push, PushToken } from "@ionic/cloud-angular";
import { GlobalVarsService } from "./global-vars-service";
import "rxjs/Rx";

@Injectable()
export class PushService {

  constructor(public http: Http,
    public platform: Platform,
    public globalVars: GlobalVarsService,
    public push: Push) {
    console.log('Hello PushService Provider');
  }

  public registerPushNotification(userId: string): void {
    if (!this.platform.is('cordova')) {
      console.warn("Push notifications not initialized. Cordova is not available - Run in physical device");
      return;
    }
    this.push.register().then((pt: PushToken) => {
      return this.push.saveToken(pt);
    }).then((pt: PushToken) => {
      console.log("Token saved: ", pt.token);
      // TODO: Let IPI back-end know this user's token
      let registerPushToken = {
        userId: userId,
        pushToken: pt.token
      };

      // TODO: Check with IPI Backend
      this.http.post(this.globalVars.getValue("apiUrl") + "MobileUserApi/RegisterToken", registerPushToken)
        .subscribe((response: Response) => {
          console.log("Push Token registered");
        }, (error) => {
          console.log("Push Token not registered");
        });
    });

    this.push.rx.notification().subscribe((msg) => {
      // let alert = this.alertCtrl.create({ message: msg.text, title: msg.title });
      // alert.present();

      // TODO: push notification handler!
    });
  }

  public unregisterPushNotification(userId: string): void {
    if (!this.platform.is('cordova')) {
      console.warn("Push notifications not initialized. Cordova is not available - Run in physical device");
      return;
    }
    this.push.unregister().then(() => {
      console.log("Push notification unregistered.");
    }, (reason: any) => {
      console.log("Unregister push notification failed.");
    });
  }

}
