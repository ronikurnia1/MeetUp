import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MeetingService } from "../../providers/meeting-service";
import { GlobalVarsService } from "../../providers/global-vars-service";
import * as moment from "moment";

@Component({
  selector: 'page-block-time',
  templateUrl: 'block-time.html'
})
export class BlockTimePage {

  private form: FormGroup;
  private blockTime: any;
  private submitAttempt: boolean = false;
  private minDate: string;
  private maxDate: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private globalVars: GlobalVarsService,
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private meetingService: MeetingService) {

    this.blockTime = navParams.get("blockTime");
    let dateValue: string = `${this.blockTime.date.substr(6, 4)}-${this.blockTime.date.substr(3, 2)}-${this.blockTime.date.substr(0, 2)}`;

    this.form = formBuilder.group({
      userId: [this.globalVars.getValue("userData").id, Validators.required],
      date: [dateValue, Validators.required],
      startTime: [this.blockTime.startTime, Validators.required],
      endTime: [this.blockTime.endTime, Validators.required],
      description: [this.blockTime.subject, Validators.required]
    });
    if (this.blockTime.id) {
      this.form.addControl("blockTimeId", new FormControl(this.blockTime.id));
    }
    this.minDate = this.globalVars.getValue("day1");
    this.maxDate = this.globalVars.getValue("day2");
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
            this.meetingService.removeBlockTime(this.form.controls["blockTimeId"].value).subscribe(response => {
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

  saveBlockTime() {
    event.stopPropagation();
    event.preventDefault();
    this.submitAttempt = true;
    if (this.form.valid) {
      if (this.blockTime.id) {
        this.updateBlockTime();
      } else {
        this.createBlockTime();
      }
    }
  }

  createBlockTime() {
    let values = this.form.value;
    values.date = moment(values.date).format("DD-MM-YYYY");
    this.meetingService.createBlockTime(values).subscribe(response => {
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

  updateBlockTime() {
    let values = this.form.value;
    values.date = moment(values.date).format("DD-MM-YYYY");
    this.meetingService.updateBlockTime(values).subscribe(response => {
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
