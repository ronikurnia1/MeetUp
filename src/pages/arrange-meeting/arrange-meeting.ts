import { Component, NgZone } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  NavController, NavParams, ToastController,
  AlertController, LoadingController, Events
} from "ionic-angular";
import * as moment from "moment";
import { GlobalVarsService } from "../../providers/global-vars-service";
import { MeetingService } from "../../providers/meeting-service";

@Component({
  selector: "page-arrange-meeting",
  templateUrl: "arrange-meeting.html"
})
export class ArrangeMeetingPage {

  private recipient: any;
  private subjectSelectOptions = { title: "Subject" };
  private locationSelectOptions = { title: "Location" };

  private technologies: any;
  private locations: any;
  private minDate: string;
  private maxDate: string;

  private submitAttempt: boolean = false;

  private form: FormGroup;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private loadCtrl: LoadingController,
    private formBuilder: FormBuilder,
    private events: Events,
    private zone: NgZone,
    private globalVars: GlobalVarsService,
    private meetingService: MeetingService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController) {


    this.recipient = navParams.get("selectedUser");

    this.minDate = this.globalVars.getValue("day1");
    this.maxDate = this.globalVars.getValue("day2");

    // initial value for best-time slot
    // TODO: get this value from Backend
    let bestTimeSlot = {
      date: this.minDate,
      startTime: "10:00",
      endTime: "11:00"
    };

    // build form
    this.form = this.formBuilder.group({
      recipient: [this.recipient],
      subject: ["", Validators.required],
      customSubject: ["", Validators.required],
      date: [this.minDate, Validators.required],
      startTime: [bestTimeSlot.startTime, Validators.required],
      endTime: [bestTimeSlot.endTime, Validators.required],
      location: ["", Validators.required],
      remarks: ["", Validators.required]
    });
    this.form.controls["customSubject"].disable({ onlySelf: true });
    this.getSuppotingData();
  }


  getSuppotingData() {
    let loader = this.loadCtrl.create({
      content: "Please wait..."
    });
    loader.present();


    this.meetingService.getSubjects().subscribe(response => {
      this.technologies = response.data;
      this.meetingService.getLocations().subscribe(response => {
        this.locations = response.data;
        loader.dismissAll();
      }, error => {
        loader.dismissAll();
        let toast = this.toastCtrl.create({
          message: error,
          duration: 3000,
          position: "bottom"
        });
        toast.present();
      });
    }, error => {
      loader.dismissAll();
      let toast = this.toastCtrl.create({
        message: error,
        duration: 3000,
        position: "bottom"
      });
      toast.present();
    });
  }

  sendInvitation() {
    // console.log("data:", JSON.stringify(this.form.value));
    this.submitAttempt = true;
    if (this.form.valid) {
      // loading 
      let loader = this.loadCtrl.create({
        content: "Please wait..."
      });
      loader.present();

      this.meetingService.sendInvitation(this.form.value).subscribe(response => {
        loader.dismissAll();
        let toast = this.toastCtrl.create({
          message: response.message,
          duration: 3000,
          position: "bottom"
        });
        toast.present();
        if (response.result === "OK") {
          // emit event: meeting:inviteMeetingSuccess
          this.events.publish("meeting:inviteMeetingSuccess", null);
          // go back to the previous screen          
          this.navCtrl.pop({ animate: true });
        }
      }, error => {
        loader.dismissAll();
        let alert = this.alertCtrl.create({
          title: "Arrange Meeting Failed",
          subTitle: error.message,
          buttons: ['OK']
        });
        alert.present();
      });
    }

    // do the trick to resolve issue: UI doesn't get updated
    this.zone.run(() => {
      this.form.updateValueAndValidity({ onlySelf: true });
    });
  }


  ionViewDidLoad() {
    console.log("ionViewDidLoad ArrangeMeetingPage");
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
  /**
   * Date Format Helper
   */
  getDateFormated(value: Date, format: string): string {
    return moment(value).format(format);
  }

}
