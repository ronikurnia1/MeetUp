import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { MeetingService } from "../../providers/meeting-service";

@Component({
  selector: 'page-save-attendance-data',
  templateUrl: 'save-attendance-data.html'
})
export class SaveAttendanceDataPage {

  profile = {};
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private meetingService: MeetingService,
    private toastCtrl: ToastController) {
    this.profile = navParams.get("profile");
  }

  saveScannedData(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    // TODO: mapping the scanned data & save it to server
    this.meetingService.saveAttendanceRegistration(this.profile).subscribe(response => {
      let toast = this.toastCtrl.create({
        message: response.message,
        duration: 3000,
        position: "bottom"
      });
      toast.present();
      if (response.result === "OK") {
        // Go back to the scanner page
        this.navCtrl.pop();
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SaveAttendanceDataPage');
  }

}
