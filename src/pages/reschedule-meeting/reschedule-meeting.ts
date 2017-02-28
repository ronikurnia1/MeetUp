import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, Events } from "ionic-angular";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as moment from "moment";
import { MeetingService } from "../../providers/meeting-service";
import { GlobalVarsService } from "../../providers/global-vars-service";

@Component({
  selector: 'page-reschedule-meeting',
  templateUrl: 'reschedule-meeting.html'
})
export class RescheduleMeetingPage {

  public meeting: any;

  private submitAttempt: boolean = false;

  private minDate: string;
  private maxDate: string;
  private form: FormGroup;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private zone: NgZone,
    private meetingService: MeetingService,
    private globalVars: GlobalVarsService,
    private loadCtrl: LoadingController,
    private toastCtrl: ToastController,
    private formBuilder: FormBuilder,
    private events: Events) {
    this.meeting = navParams.get("meetingData");

    this.minDate = navParams.get("minDate");
    this.maxDate = navParams.get("maxDate");

    this.globalVars = globalVars;

    // TODO: get this value from Backend
    let bestTimeSlot = {
      date: this.minDate,
      startTime: "10:00",
      endTime: "11:00"
    };


    //this.getSuppotingData();

    // build form
    this.form = this.formBuilder.group({
      date: [this.minDate, Validators.required],
      startTime: [bestTimeSlot.startTime, Validators.required],
      endTime: [bestTimeSlot.endTime, Validators.required]
    });

  }

  // getSuppotingData() {
  //   let loader = this.loadCtrl.create({
  //     content: "Please wait..."
  //   });
  //   loader.present();

  //   this.meetingService.getLocations().subscribe(response => {
  //     this.locations = response.data;
  //     loader.dismissAll();
  //   }, error => {
  //     loader.dismissAll();
  //     let toast = this.toastCtrl.create({
  //       message: error,
  //       duration: 3000,
  //       position: "bottom"
  //     });
  //     toast.present();
  //   });
  // }


  ionViewDidLoad() {
    console.log('ionViewDidLoad RescheduleMeetingPage');
  }


  rescheduleMeeting() {
    event.stopPropagation();
    event.preventDefault();

    // validate location & reason
    this.submitAttempt = true;
    if (this.form.valid) {

      let rescheduleData = {
        meetingId: this.meeting.id,
        byUserEmail: this.globalVars.getValue("userData").email,
        statusName: "rescheduled",
        startTime: moment(this.form.controls["date"].value + " " + this.form.controls["startTime"].value).format("DD-MM-YYYY HH:mm"),
        endTime: moment(this.form.controls["date"].value + " " + this.form.controls["endTime"].value).format("DD-MM-YYYY HH:mm")
      };

      this.meetingService.rescheduleMeeting(rescheduleData)
        .subscribe(response => {
          let message: string = "";
          // console.log("Response:", data);
          if (response.result === "OK") {
            message = "You have resecheduled the meeting.";
          } else {
            message = response.message;
          }
          let toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: "bottom"
          });
          toast.present().then(value => {
            // if rescheduling success
            // then publish event to notify to udate item either on hosting or schedule
            // and then get back to the previous page 
            if (response.result === "OK") {
              this.events.publish("meeting:rescheduleSuccess", this.meeting)
              this.navCtrl.pop();
            }
          });
        }, error => {
          let toast = this.toastCtrl.create({
            message: error,
            duration: 3000,
            position: "bottom"
          });
          toast.present();
        });
    }

  }

  /**
   * Date Format Helper
   */
  getDateFormated(value: string, format: string): string {
    // API format date is DD-MM-YYYY
    // Change it to YYYY-MM-DD
    let dateValue: string = `${value.substr(6, 4)}-${value.substr(3, 2)}-${value.substr(0, 2)}`;
    return moment(dateValue).format(format);
  }

}
