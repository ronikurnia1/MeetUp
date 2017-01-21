import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from "moment";
import { Meeting } from "../../domain/meeting";
import { MeetingService } from "../../providers/meeting-service";
import { GlobalVarsService } from "../../providers/global-vars-service";

@Component({
  selector: 'page-calendar-view',
  templateUrl: 'calendar-view.html'
})
export class CalendarViewPage {
  @ViewChild('calendarSlides')
  slider: Slides;

  public last2WeeksCal: WeekCalendar;
  public lastWeekCal: WeekCalendar;
  public currentWeekCal: WeekCalendar;
  public nextWeekCal: WeekCalendar;
  public next2WeeksCal: WeekCalendar;

  public slideOptions = {
    initialSlide: 2,
    loop: false
  };

  public blocking = {
    timeStarts: "",
    timeEnds: ""
  }

  public schedules: Array<Meeting> = [];
  private form: FormGroup;
  private submitAttempt: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private meetingService: MeetingService,
    private globalVars: GlobalVarsService,
    private toastCtrl: ToastController,
    private formBuilder: FormBuilder) {

    let currentDate = new Date();
    let firstDayLast2Weeks = new Date().setDate(currentDate.getDate() - currentDate.getDay() - 14);
    let firstDayLastWeek = new Date().setDate(currentDate.getDate() - currentDate.getDay() - 7);
    let firstDayCurrentWeek = currentDate.setDate(currentDate.getDate() - currentDate.getDay());
    let firstDayNextWeek = new Date().setDate(currentDate.getDate() - currentDate.getDay() + 7);
    let firstDayNext2Weeks = new Date().setDate(currentDate.getDate() - currentDate.getDay() + 14);

    this.last2WeeksCal = this.populateWeekCalendar(new Date(firstDayLast2Weeks));
    this.lastWeekCal = this.populateWeekCalendar(new Date(firstDayLastWeek));
    this.currentWeekCal = this.populateWeekCalendar(new Date(firstDayCurrentWeek));
    this.nextWeekCal = this.populateWeekCalendar(new Date(firstDayNextWeek));
    this.next2WeeksCal = this.populateWeekCalendar(new Date(firstDayNext2Weeks));

    this.form = this.formBuilder.group({
      date: [new Date()],
      startTime: ["", Validators.required],
      endTime: ["", Validators.required],
      description: ["", Validators.required]
    });
  }

  blockTime() {
    event.preventDefault();
    event.stopPropagation();
    this.submitAttempt = true;
    if (this.form.valid) {
      this.meetingService.createBlockTime(this.form.value).subscribe(response => {
        let toast = this.toastCtrl.create({
          message: response.message,
          duration: 3000,
          position: "bottom"
        });
        toast.present();
        if (response.result === "OK") {
          // go back to the previous screen
          // this.navCtrl.pop({ animate: true });
          // reset the form
          this.form.reset();
          this.submitAttempt = false;
        }
      });
    }
  }

  synchToPhoneCalendar() {
    // show toast
    let toast = this.toastCtrl.create({
      message: "Calender has been sync successfully.",
      duration: 3000,
      position: "bottom"
    });
    toast.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CalendarViewPage');
    this.getTodayMeetingSchedule();
  }

  selectDate(day: WeekDay) {
    this.last2WeeksCal.weekDays.forEach(itm => itm.selected = itm.display === day.display);
    this.lastWeekCal.weekDays.forEach(itm => itm.selected = itm.display === day.display);
    this.currentWeekCal.weekDays.forEach(itm => itm.selected = itm.display === day.display);
    this.nextWeekCal.weekDays.forEach(itm => itm.selected = itm.display === day.display);
    this.next2WeeksCal.weekDays.forEach(itm => itm.selected = itm.display === day.display);
    this.form.controls["date"].setValue(day.date);
  }

  /**
   * Get today's meeting schedule of logged user
   */
  getTodayMeetingSchedule() {
    this.schedules = [];
    let userEmail: string = this.globalVars.getValue("userData").email;
    this.meetingService.getMeetings(userEmail, "my").subscribe(data => {
      // console.log("Meeting:", JSON.stringify(data));
      data.forEach(itm => {
        this.schedules.push(this.meetingService.buildMeeting(itm));
      });
    }, error => {
      this.schedules = [];
      console.log("Error", error);
    });
  }

  onSlideChanged(event: Event) {

  }

  /**
   * Date Format Helper
   */
  getDateFormated(value: Date, format: string): string {
    return moment(value).format(format);
  }

  /**
   * Populate week calendar based-on given day
   */
  private populateWeekCalendar(firstDate: Date): WeekCalendar {
    let weekCal: WeekCalendar = {
      monthYear: "",
      weekDays: []
    };
    for (let i = 0; i <= 6; i++) {
      let date = new Date(firstDate);
      date.setDate(date.getDate() + i);
      weekCal.weekDays.push({
        display: date.getDate(),
        date: date,
        disabled: false,
        selected: date.getDate() === new Date().getDate()
      });
    }
    // check if the month of first day and last is same
    if (weekCal.weekDays[0].date.getMonth() !== weekCal.weekDays[6].date.getMonth()) {
      weekCal.monthYear = this.getDateFormated(weekCal.weekDays[0].date, "MMM-").toUpperCase()
        + this.getDateFormated(weekCal.weekDays[6].date, "MMM YYYY").toUpperCase();
    }
    else {
      weekCal.monthYear = this.getDateFormated(weekCal.weekDays[0].date, "MMMM YYYY").toUpperCase();
    }
    return weekCal;
  }
}

interface WeekCalendar {
  monthYear: string;
  weekDays: Array<WeekDay>;
}

interface WeekDay {
  display: number;
  date: Date;
  disabled: boolean;
  selected: boolean;
}