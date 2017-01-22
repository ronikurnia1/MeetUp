import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthService } from "../../providers/auth-service";

@Component({
  selector: 'page-disclimer',
  templateUrl: 'disclimer.html'
})
export class DisclimerPage {

  public title: string;
  public disclimer: {
    paragraphs: Array<string>
  };

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private authService: AuthService) {
    let subject: string = navParams.get("subject");
    this.title = subject.toLowerCase() === "terms" ? "Terms of service" : "Privacy policy";
    this.disclimer = {
      paragraphs: []
    };
    // get content
    authService.getDisclimer(subject).subscribe(response => {
      for (let p in response.data.paragraphs) {
        this.disclimer.paragraphs.push(response.data.paragraphs[p]);
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DisclimerPage');
  }

}
