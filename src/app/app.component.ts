import { Component, ViewChild } from "@angular/core";
import { Platform, AlertController, Nav } from "ionic-angular";
import { StatusBar, Splashscreen, Calendar } from "ionic-native";
import { Push, PushToken } from "@ionic/cloud-angular";
import { TabsPage } from "../pages/tabs/tabs";
import { LoginPage } from "../pages/login/login";
import { CryptoService } from "../providers/crypto-service";
import { GlobalVarsService } from "../providers/global-vars-service";

@Component({
  templateUrl: "app.html",
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;
  rootPage: any;

  constructor(public platform: Platform,
    public push: Push,
    public crypto: CryptoService,
    public alertCtrl: AlertController,
    public globalVars: GlobalVarsService) {

    platform.ready().then(() => {

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      if (window.hasOwnProperty("cordova")) {
        StatusBar.styleDefault();
        Splashscreen.hide();
      }

      // load lookups
      this.globalVars.getDataLookups().subscribe(response => {
        response.forEach(itm => {
          this.globalVars.setValue(itm.name, itm.data);
        });
      }, error => {

      });

      // check if userData stored locally
      let storedUserData = localStorage.getItem("userData");
      if (storedUserData) {
        // decrypt user data
        let decryptedUserData = this.crypto.decrypt(storedUserData);
        let userData = JSON.parse(decryptedUserData);
        // console.log("User:", JSON.stringify(userData));

        // put it into global vars
        this.globalVars.setValue("userData", userData);
        this.rootPage = TabsPage;
      } else {
        this.rootPage = LoginPage;
      }

      // register push notifiation
      this.initPushNotification();
    });
  }


  initPushNotification() {

    if (!this.platform.is('cordova')) {
      console.warn("Push notifications not initialized. Cordova is not available - Run in physical device");
      return;
    }
    this.push.register().then((pt: PushToken) => {
      return this.push.saveToken(pt);
    }).then((pt: PushToken) => {
      // let alert = this.alertCtrl.create({ message: "Saved token: " + pt.token, title: "Token Saved" });
      // alert.present();
      console.log("Token saved: ", pt.token);
    });

    this.push.rx.notification().subscribe((msg) => {
      let alert = this.alertCtrl.create({ message: msg.text, title: msg.title });
      alert.present();
    });
  }

}
