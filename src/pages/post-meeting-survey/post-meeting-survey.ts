import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-post-meeting-survey',
  templateUrl: 'post-meeting-survey.html'
})
export class PostMeetingSurveyPage {

  constructor(public navCtrl: NavController, 
  public navParams: NavParams) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PostMeetingSurveyPage');
  }

}
