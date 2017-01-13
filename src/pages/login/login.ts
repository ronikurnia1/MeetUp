import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { App, NavController, ToastController } from 'ionic-angular';
import { TabsPage } from "../tabs/tabs";
import { AuthService } from "../../providers/auth-service";
import { CryptoService } from "../../providers/crypto-service";
import { GlobalVarsService } from "../../providers/global-vars-service";
import { RegisterPage } from "../register/register";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  loginForm: FormGroup;
  submitAttempt: boolean = false;

  public pullDown: boolean = true;

  constructor(
    private app: App,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private authService: AuthService,
    private crypto: CryptoService,
    private globalVars: GlobalVarsService,
    private formBuilder: FormBuilder) {
    // build login form
    this.loginForm = formBuilder.group({
      // email: ['', Validators.compose([Validators.required, Validators.pattern(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)])],
      email: ['', Validators.compose([Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])],
      password: ['', Validators.required],
      rememberMe: [false]
    })

    //this.doOnOrientationChange();
    //window.addEventListener('orientationchange', this.doOnOrientationChange);
  }

  doOnOrientationChange() {
    console.log("oreintation:", window.orientation);
    switch (window.orientation) {
      case -90:
      case 90:
        this.pullDown = false;
        break;
      default:
        // potrait
        this.pullDown = true;
        break;
    }
  }

  /**
   * Register
   */
  register() {
    let register = this.navCtrl.getViews().find(itm => itm.name === "RegisterPage");
    if (register) {
      this.navCtrl.push(register, { title: "Register" });
    } else {
      this.navCtrl.push(RegisterPage, { title: "Register" });
    }
  }

  /**
   * This will be called when the user clicks on the Login button
   */
  login(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    this.submitAttempt = true;
    if (this.loginForm.valid) {
      this.callApiLogin();
    }
  }

  private callApiLogin() {
    // call backend login API
    this.authService.authenticateUser(
      this.loginForm.controls["email"].value,
      this.loginForm.controls["password"].value).subscribe(loginResponse => {
        if (loginResponse.result === "OK") {
          // console.log("login response:", loginResponse.userProfile);
          // put user's data into globalVars
          this.globalVars.setValue("userData", loginResponse.userProfile);
          if (this.loginForm.controls["rememberMe"].value) {
            // save encrypted user's data on storage
            // for remembering
            let encryptedUserData: string = this.crypto.encrypt(JSON.stringify(loginResponse.userProfile));
            localStorage.setItem("userData", encryptedUserData);
          }
          // check if Tabs already exist
          let tabsPage = this.app.getRootNav().getViews().find(itm => itm.name === "TabsPage");
          if (tabsPage) {
            console.log("TabsPage exists");
            this.app.getRootNav().push(tabsPage);
          } else {
            console.log("TabsPage not exists");
            this.app.getRootNav().push(TabsPage);
          }
          // reset the form
          this.submitAttempt = false;
          this.loginForm.reset();
        } else {
          let toast = this.toastCtrl.create({
            message: loginResponse.Message,
            duration: 3000,
            position: "bottom"
          });
          toast.present();
        }
      });
  }


  forgetPassword(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    // console.log("Forget password");
    if (this.loginForm.controls["email"].valid) {
      // call auth service for password ressetting
      this.authService.resetPassword(this.loginForm.controls["email"].value)
        .subscribe(data => {
          let toast = this.toastCtrl.create({
            message: data.Message,
            duration: 4000,
            position: "bottom"
          });
          toast.present();
        });
    } else {
      let toast = this.toastCtrl.create({
        message: "Please type valid email address.",
        duration: 4000,
        position: "bottom"
      });
      toast.present();
    }
  }

  ionViewDidLoad() {
    this.doOnOrientationChange();
    // console.log('ionViewDidLoad LoginPage');
  }
}
