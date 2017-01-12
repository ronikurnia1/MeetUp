import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GlobalVarsService } from "../../providers/global-vars-service";

@Component({
  selector: 'page-my-qr-code',
  templateUrl: 'my-qr-code.html'
})
export class MyQrCodePage {
  myQrCode: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private globalVars: GlobalVarsService) {
    this.myQrCode = globalVars.getValue("userData").id;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyQrCodePage');
  }


}
