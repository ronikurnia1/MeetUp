import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { GlobalVarsService } from "../../providers/global-vars-service";
import { AuthService } from "../../providers/auth-service";

@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html'
})
export class ChangePasswordPage {
  form: FormGroup;
  submitAttempt: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private globalVars: GlobalVarsService,
    private authService: AuthService,
    private toastCtrl: ToastController) {

    this.form = formBuilder.group({
      id: [this.globalVars.getValue("userData").id],
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangePasswordPage');
  }

  changePassword() {
    this.submitAttempt = true;
    if (this.form.valid) {

      // Call backend Registration API
      this.authService.changePassword(this.form.value).subscribe(response => {
        let toast = this.toastCtrl.create({
          message: response.message,
          duration: 3000,
          position: "bottom"
        });
        toast.present();
        if (response.result === "OK") {
          // redirect to the previous page
          this.navCtrl.pop();
        }
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




}
