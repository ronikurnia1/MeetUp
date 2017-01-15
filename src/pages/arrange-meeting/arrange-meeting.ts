import { Component, NgZone } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NavController, NavParams, ToastController } from "ionic-angular";
import * as moment from "moment";
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

  private scheduleOption: string;
  private submitAttempt: boolean = false;

  private bestTimeSlot: {
    date: string,
    startTime: string,
    endTime: string
  };
  private manualTime: {
    date: string,
    startTime: string,
    endTime: string
  }

  private form: FormGroup;
  autoManufacturers: string = "";

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private zone: NgZone,
    private meetingService: MeetingService,
    private toastCtrl: ToastController) {

    this.technologies = [
      { name: "Industry Automations", value: "industryOtomation" },
      { name: "Nano Engeenering", value: "nanoEngeenering" },
      { name: "Space Exploration", value: "spaceExploration" },
      { name: "Robotic Devices", value: "roboticDevices" },
      { name: "Marine Processing", value: "marineProcessing" },
      { name: "Micro Satellite", value: "microSatellite" },
      { name: "Other", value: "other" }
    ];
    this.locations = [
      { name: "Room #1", value: "room1" },
      { name: "Room #2", value: "room2" },
      { name: "Room #3", value: "room3" },
      { name: "Room #4", value: "room4" },
      { name: "Room #5", value: "room5" },
      { name: "Room #6", value: "room6" },
      { name: "Room #7", value: "room7" }
    ];
    this.recipient = navParams.get("selectedUser");
    // TODO: get this value from Backend
    this.bestTimeSlot = {
      date: moment(new Date()).format("YYYY-MM-DD"),
      startTime: "15:30",
      endTime: "16:30"
    };

    // initial value for manualTime
    this.manualTime = {
      date: moment(new Date()).format("YYYY-MM-DD"),
      startTime: "08:00",
      endTime: "09:00"
    };

    // build form
    this.form = this.formBuilder.group({
      recipient: [this.recipient],
      subject: ["", Validators.required],
      customSubject: ["", Validators.required],
      date: [this.bestTimeSlot.date, Validators.required],
      startTime: [this.bestTimeSlot.startTime, Validators.required],
      endTime: [this.bestTimeSlot.endTime, Validators.required],
      location: ["", Validators.required],
      remarks: ["", Validators.required]
    });
    this.scheduleOption = "bestTimeSlot";
    this.form.controls["customSubject"].disable({ onlySelf: true });
  }

  sendInvitation() {
    console.log("data:", JSON.stringify(this.form.value));
    this.submitAttempt = true;
    if (this.form.valid) {
      console.log("form valid");
      this.meetingService.sendInvitation(this.form.value).subscribe(response => {
        let toast = this.toastCtrl.create({
          message: response.message,
          duration: 3000,
          position: "bottom"
        });
        toast.present();
        if (response.result === "OK") {
          // go back to the previous screen
          this.navCtrl.pop({ animate: true }).then(value => {
            this.navCtrl.pop({ animate: true });
          });
        }
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

  scheduleOptionSelected(value: string) {
    // console.log("Value:", value);
    // do the trick to resolve issue: UI doesn't get updated
    this.zone.run(() => {
      this.scheduleOption = value;
      if (value === "bestTimeSlot") {
        // set it as per bestTimeSlot
        this.form.controls["date"].setValue(this.bestTimeSlot.date);
        this.form.controls["startTime"].setValue(this.bestTimeSlot.startTime);
        this.form.controls["endTime"].setValue(this.bestTimeSlot.endTime);
      }
    });
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