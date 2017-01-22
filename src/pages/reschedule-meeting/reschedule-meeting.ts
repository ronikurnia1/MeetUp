import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, ToastController, Events } from "ionic-angular";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Meeting } from "../../domain/meeting";
import * as moment from "moment";
import { MeetingService } from "../../providers/meeting-service";
import { GlobalVarsService } from "../../providers/global-vars-service";

@Component({
  selector: 'page-reschedule-meeting',
  templateUrl: 'reschedule-meeting.html'
})
export class RescheduleMeetingPage {
  private locationSelectOptions = { title: "Location" };
  private locations: any[];

  public meeting: Meeting;

  private scheduleOption: string = "bestTimeSlot";
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

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private zone: NgZone,
    private meetingService: MeetingService,
    private globalVars: GlobalVarsService,
    private toastCtrl: ToastController,
    private formBuilder: FormBuilder,
    private events: Events) {
    this.meeting = navParams.get("meetingData");
    this.globalVars = globalVars;

    // TODO: get this value from Backend
    this.bestTimeSlot = {
      date: moment(new Date()).format("YYYY-MM-DD"),
      startTime: "15.30",
      endTime: "16.30"
    };

    // initial value for manualTime
    this.manualTime = {
      date: moment(new Date()).format("YYYY-MM-DD"),
      startTime: "08:00",
      endTime: "09:00"
    };

    this.meetingService.getLocations().subscribe(response => {
      this.locations = response.data;
    });

    // build form
    this.form = this.formBuilder.group({
      location: [this.meeting.location, Validators.required],
      reason: ["", Validators.required]
    });


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RescheduleMeetingPage');
  }


  rescheduleMeeting() {
    event.stopPropagation();
    event.preventDefault();

    // validate location & reason
    this.submitAttempt = true;
    if (this.form.valid) {
      let bestSlotStartTime = this.bestTimeSlot.date + this.bestTimeSlot.startTime;
      let manualStartTime = this.manualTime.date + this.manualTime.startTime;

      let bestSlotEndTime = this.bestTimeSlot.date + this.bestTimeSlot.endTime;
      let manualEndTime = this.manualTime.date + this.manualTime.endTime;

      let rescheduleData = {
        meetingId: this.meeting.id,
        recipientEmail: this.globalVars.getValue("userData").email,
        statusName: "rescheduled",
        reason: this.form.controls["reason"].value,
        location: this.form.controls["location"].value,
        startTime: this.scheduleOption === "bestTimeSlot" ? bestSlotStartTime : manualStartTime,
        endTime: this.scheduleOption === "bestTimeSlot" ? bestSlotEndTime : manualEndTime,
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
        });
    }

  }


  scheduleOptionSelected(value: string) {
    // console.log("Value:", value);
    // do the trick to resolve issue: UI doesn't get updated
    this.zone.run(() => {
      this.scheduleOption = value;
    });
  }

  /**
   * Date Format Helper
   */
  getDateFormated(value: Date, format: string): string {
    return moment(value).format(format);
  }

}
