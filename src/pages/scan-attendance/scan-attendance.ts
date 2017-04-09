import { Component } from "@angular/core";
import { NavController, NavParams, Platform, AlertController } from "ionic-angular";
import { BarcodeScanner } from "ionic-native";
import { AuthService } from "../../providers/auth-service";
import { SaveAttendanceDataPage } from "../save-attendance-data/save-attendance-data";

@Component({
  selector: "page-scan-attendance",
  templateUrl: "scan-attendance.html"
})
export class ScanAttendancePage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private platform: Platform,
    private authService: AuthService,
    private alertCtrl: AlertController) { }

  scan(type: string) {
    // // Testing only
    // // get person data
    // this.authService.getProfile("personId").subscribe(response => {
    //   if (response.result === "OK") {
    //     let page = this.navCtrl.getViews().find(itm => itm.name === "SaveAttendanceDataPage") || SaveAttendanceDataPage;
    //     this.navCtrl.push(page, { profile: response.profile }, { animate: true });
    //   } else {
    //     let alert = this.alertCtrl.create({
    //       title: "Scan failed",
    //       subTitle: response.message,
    //       buttons: ['OK']
    //     });
    //     alert.present();
    //   }
    // });

    BarcodeScanner.scan().then((barcodeData) => {
      if (!barcodeData.cancelled) {
        // console.log("Barcode:", barcodeData);
        let personId = barcodeData.text;
        // get person data
        this.authService.getProfile(personId).subscribe(response => {
          if (response.result === "OK") {
            //let page = this.navCtrl.getViews().find(itm => itm.name === "SaveAttendanceDataPage") || SaveAttendanceDataPage;
            this.navCtrl.push(SaveAttendanceDataPage, { profile: response.profile }, { animate: true });
          } else {
            let alert = this.alertCtrl.create({
              title: "Scan failed",
              subTitle: response.message,
              buttons: ['OK']
            });
            alert.present();
          }
        });
      }
    }, (err) => {
      console.log("Error:", err);
      let alert = this.alertCtrl.create({
        title: "Scan failed",
        subTitle: err,
        buttons: ['OK']
      });
      alert.present();
    });
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ScanAttendancePage");
  }

}
