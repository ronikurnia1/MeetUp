import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MeetingService } from "../../providers/meeting-service";
import { GlobalVarsService } from "../../providers/global-vars-service";

@Component({
  selector: 'page-block-time',
  templateUrl: 'block-time.html'
})
export class BlockTimePage {

  form: FormGroup;
  blockTime = {};
  submitAttempt: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private globalVars: GlobalVarsService,
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private meetingService: MeetingService) {

    let blockTime = navParams.get("blockTime");
    let dateValue: string = `${blockTime.date.substr(6, 4)}-${blockTime.date.substr(3, 2)}-${blockTime.date.substr(0, 2)}`;

    this.form = formBuilder.group({
      blockTimeId: [blockTime.id, Validators.required],
      userId: [this.globalVars.getValue("userData").id, Validators.required],
      date: [dateValue, Validators.required],
      startTime: [blockTime.startTime, Validators.required],
      endTime: [blockTime.endTime, Validators.required],
      description: [blockTime.subject, Validators.required]
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BlockTimePage');
  }

  removeBlockTime() {
    event.stopPropagation();
    event.preventDefault();
    let alert = this.alertCtrl.create({
      title: "Remove block-time",
      subTitle: "Are you sure you want to remove this block-time?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {
            console.log("Cancel remove");
          }
        },
        {
          text: "Yes",
          handler: () => {
            // remove block-time
            this.meetingService.removeBlockTime(this.form.value).subscribe(response => {
              let toast = this.toastCtrl.create({
                message: response.message,
                duration: 3000,
                position: "bottom"
              });
              toast.present();
              if (response.result === "OK") {
                // go back to the previous screen
                this.navCtrl.pop({ animate: true });
              }
            });
          }
        }
      ]
    });
    alert.present();
  }


  updateBlockTime() {
    event.stopPropagation();
    event.preventDefault();
    this.submitAttempt = true;
    if (this.form.valid) {
      this.meetingService.updateBlockTime(this.form.value).subscribe(response => {
        let toast = this.toastCtrl.create({
          message: response.message,
          duration: 3000,
          position: "bottom"
        });
        toast.present();
        if (response.result === "OK") {
          // go back to the previous screen
          this.navCtrl.pop({ animate: true });
        }
      });
    }
  }
}
