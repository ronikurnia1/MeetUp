import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MeetingService } from "../../providers/meeting-service";

@Component({
  selector: 'page-scan-badge',
  templateUrl: 'scan-badge.html'
})
export class ScanBadgePage {

  private profile: any;
  private form: FormGroup;
  private technologies: any[];

  private submitAttempt: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private zone: NgZone,
    private toastCtrl: ToastController,
    private formBuilder: FormBuilder,
    private meetingService: MeetingService) {
    this.profile = navParams.get("profile");

    this.technologies = [
      { name: "Industry Automations", value: "industryOtomation" },
      { name: "Nano Engeenering", value: "nanoEngeenering" },
      { name: "Space Exploration", value: "spaceExploration" },
      { name: "Robotic Devices", value: "roboticDevices" },
      { name: "Marine Processing", value: "marineProcessing" },
      { name: "Micro Satellite", value: "microSatellite" },
      { name: "Other", value: "other" }
    ];

    this.form = this.formBuilder.group({
      profile: this.profile,
      subject: ["", Validators.required],
      customSubject: ["", Validators.required],
      followUp: ["", Validators.required],
      remarks: ["", Validators.required],
      rate: [0]
    });
    this.form.controls["customSubject"].disable({ onlySelf: true });
  }


  updateSubject(value: any) {
    this.zone.run(() => {
      if (value !== "Other") {
        this.form.controls["customSubject"].setValue("");
        this.form.controls["customSubject"].disable({ onlySelf: true });
      }
      else {
        this.form.controls["customSubject"].enable({ onlySelf: true });
      }
    });
  }

  submitScanedBadge() {
    this.submitAttempt = true;
    console.log("Form:", JSON.stringify(this.form.value));
    if (this.form.valid) {
      this.meetingService.submitScanedBadge(this.form.value).subscribe(response => {
        // show toast
        let toast = this.toastCtrl.create({
          message: response.message,
          duration: 3000,
          position: "bottom"
        });
        toast.present().then(data => {
          if (response.result === "OK") {
            // go back to the previous page
            this.navCtrl.pop();
          }
        });
      });
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ScanBadgePage');
  }

}
