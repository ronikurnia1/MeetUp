import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthService } from "../../providers/auth-service";

@Component({
  selector: 'page-disclimer',
  templateUrl: 'disclimer.html'
})
export class DisclimerPage {

  private title: string;
  private disclimer: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private authService: AuthService) {
    let subject: string = navParams.get("subject").toLowerCase();
    this.title = subject === "terms" ? "Terms of service" : "Privacy policy";
    // get content
    authService.getDisclimer(subject).subscribe(response => {
      this.disclimer = response.content;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DisclimerPage');
  }

}
