import { Injectable } from '@angular/core';
import { Http, Response, Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { Platform, Tabs, Events, ToastController, AlertController, NavController } from "ionic-angular";
import { Push, PushToken } from "@ionic/cloud-angular";
import { GlobalVarsService } from "./global-vars-service";
import "rxjs/Rx";


const BEARER_TOKEN: string = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNzFiNTY0ZS0wMmYzLTQyMzQtOGE0OS1jYWRjZDBmM2IwMWQifQ.RZSlXBB31dnA1FJJDm0AaB7LkxBotGd4MiwQ_8RccFc";
const PUSH_PROFILE: string = "ipipush";

@Injectable()
export class PushService {
  constructor(public http: Http,
    public platform: Platform,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public globalVars: GlobalVarsService,
    public events: Events,
    public push: Push) {
    // console.log('Hello PushService Provider');
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
      let storePushToken = {
        userId: userId,
        pushToken: pt.token
      };
      // Save device's registered token for chat purpose
      this.globalVars.setValue("pushToken", pt.token);

      // TODO: Let IPI backend know this user's token
      // TODO: Check with IPI backend
      this.http.post(this.globalVars.getValue("apiUrl") + "MobileUserApi/RegisterToken", storePushToken)
        .subscribe((response: Response) => {
          console.log("Push Token registered");
        }, (error) => {
          console.log("Push Token not registered");
        });
    });

    this.push.rx.notification().subscribe((msg) => {
      // Notifications type: Announcement & Meeting    
      let notifType: string = msg.payload["type"];
      if (msg.app.asleep || msg.app.closed) {
        // background process
        // redirect to Notifications or Chat    
        let selectedTabEvent: string = "app:selectTabEvent";
        // 1 = notification page, 2 = chat page
        let tabIndex: number = notifType === "notification" ? 1 : 2;
        this.events.publish(selectedTabEvent, tabIndex);
      } else {
        // Foreground process
        if (notifType === "notification") {
          // update(refresh) notifications
          let refreshNotifEvent: string = "app:refreshNotification";
          this.events.publish(refreshNotifEvent);
        }
        // Use toast
        this.showToast(msg.text);
      }
      // let alert = this.alertCtrl.create({ message: JSON.stringify(msg.payload), title: msg.title });
      // alert.present();
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

  /**
   * Push Notify user
   * type: notif or chat
   */
  public pushNotif(userId: string, message: string, title: string, type: string): void {
    //this.http.get(this.globalVars.getValue("apiUrl") + "MobileUserApi/GetPushToken?userId=" + userId)
    this.http.get("http://52.77.249.130/api/MobileMeetingApi/GetLocations")
      .subscribe((response: Response) => {
        let data = response.json();
        data.data.token = "TEST";
        // Check if token available
        if (data.result === "OK" && data.data.token) {
          // TODO: fix this!
          let token: string = "exkyS_1bxcY:APA91bFvrDp3Q3nqDqUL7wQ-UUzUn0BiYrTvfHYgbIvFfw8PsOSWfX8L3XaVGSPyKfX1qWigI6kDOvwZ-ZBcX5NGggMKA-FbVgUt4up1k81SYaW-bXHYFFVgPYB71g88C-fUSNM7m_dT";
          //let token: string = data.data.token;
          let headers = new Headers();
          headers.append("Content-Type", "application/json");
          headers.append("Authorization", BEARER_TOKEN);
          let notifData = {
            tokens: [token],
            profile: PUSH_PROFILE,
            notification: {
              message: message,
              title: title,
              payload: {
                type: type
              }
            },
            send_to_all: false
          };

          // push notification
          this.http.post("https://api.ionic.io/push/notifications", notifData, { headers: headers }).subscribe((result: Response) => {
            console.log("Push notif sent successfully.");
          }, (err) => {
            console.log("Push notif sent failed:", err);
          });
        }
      }, (error) => {
        console.log("Get user token failed:", error);
      });
  };

  showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 4000,
      position: "bottom"
    });
    toast.present();
  }


}
