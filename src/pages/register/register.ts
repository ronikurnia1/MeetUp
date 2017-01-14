import { Component, ChangeDetectorRef } from "@angular/core";
import { Camera } from "ionic-native";
import { FormBuilder, FormGroup, Validators, AbstractControl } from "@angular/forms";
import { App, NavController, NavParams, AlertController, ToastController, ActionSheetController } from "ionic-angular";
import { TabsPage } from "../tabs/tabs"; import { DisclimerPage } from "../disclimer/disclimer";
import { GlobalVarsService } from "../../providers/global-vars-service";
import { AuthService } from "../../providers/auth-service";

/**
 * This page is used for registration 
 * and update user profile
 */
@Component({
  selector: "page-register",
  templateUrl: "register.html"
})
export class RegisterPage {

  private registerForm: FormGroup;
  private countries: any;
  private titles: any;
  private submitAttempt: boolean = false;
  private screenTitle: string;
  private buttonTitle: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private app: App,
    private formBuilder: FormBuilder,
    private globalVars: GlobalVarsService,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private actionCtrl: ActionSheetController,
    private changeDetec: ChangeDetectorRef) {

    this.screenTitle = navParams.get("title");
    this.buttonTitle = this.screenTitle.toLowerCase() === "register" ? "Register" : "Save";

    this.submitAttempt = false;
    this.titles = [
      { name: "Mr.", value: "mr." },
      { name: "Ms.", value: "ms." },
      { name: "Mrs.", value: "mrs." }
    ];
    globalVars.getCountries().subscribe(data => {
      this.countries = data;
      // console.log("country:", JSON.stringify(this.countries));
    });

    if (this.screenTitle.toLowerCase() === "register") {
      // build registration form
      this.registerForm = formBuilder.group({
        avatar: ["assets/icon/avatar.png"],
        title: [""],
        fullName: ["", Validators.required],
        mobile: ["", Validators.required],
        email: ["", Validators.compose([Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])],
        password: ["", Validators.required],
        confirmPassword: ["", Validators.required],
        country: ["", Validators.required],
        company: ["", Validators.required],
        position: [""],
        notifByEmail: [false],
        notifBySms: [false],
        notifByPush: [false],
        acceptTermsAndPrivacy: [false, requireTrueValidator]
      });
    } else {
      let profile = this.globalVars.getValue("userData");
      // build update user profile form
      this.registerForm = formBuilder.group({
        id: [profile.id],
        avatar: [profile.avatar || "assets/icon/avatar.png"],
        title: [profile.title],
        fullName: [profile.fullName, Validators.required],
        mobile: [profile.mobile, Validators.required],
        email: [profile.email, Validators.compose([Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])],
        country: [profile.country, Validators.required],
        company: [profile.company, Validators.required],
        position: [profile.position],
        notifByEmail: [profile.notifByEmail],
        notifBySms: [profile.notifBySms],
        notifByPush: [profile.notifByPush],
      });
    }
  }


  register() {
    event.preventDefault();
    event.stopPropagation();
    this.submitAttempt = true;

    if (this.registerForm.valid) {
      if (this.screenTitle.toLowerCase() === "register") {
        this.callApiRegistration();
      } else {
        this.callApiProfileUpdate();
      }
    }
  }

  callApiRegistration() {
    console.log("registration:", JSON.stringify(this.registerForm.value));
    // Call backend Registration API
    this.authService.registerUser(this.registerForm.value).subscribe(registerResponse => {
      if (registerResponse.result === "OK") {
        // put user"s data into globalVars
        let userData = {
          id: registerResponse.userId,
          title: this.registerForm.controls["title"].value,
          avatar: this.registerForm.controls["avatar"].value,
          fullName: this.registerForm.controls["fullName"].value,
          email: this.registerForm.controls["email"].value,
          company: this.registerForm.controls["company"].value,
          country: this.registerForm.controls["country"].value,
          position: this.registerForm.controls["position"].value,
          mobile: this.registerForm.controls["mobile"].value,
          userType: "delegeate",
          isAdmin: false,
          notifByEmail: this.registerForm.controls["notifByEmail"].value,
          notifBySms: this.registerForm.controls["notifBySms"].value,
          notifByPush: this.registerForm.controls["notifByPush"].value,
          about: ""
        };
        this.globalVars.setValue("userData", userData);
      }
      // show toast
      let toast = this.toastCtrl.create({
        message: registerResponse.message,
        duration: 3000,
        position: "bottom"
      });
      toast.present().then(data => {
        if (registerResponse.result === "OK") {
          // reset the form
          this.submitAttempt = false;
          this.registerForm.reset();

          // call detectChanges to prevent issue:
          // "Expression has changed after it was checked."
          this.changeDetec.detectChanges();

          // Redirect to my schedule page
          // check if Tabs already exist
          let tabsPage = this.app.getRootNav().getViews().find(itm => itm.name === "TabsPage");
          if (tabsPage) {
            console.log("TabsPage exists");
            this.app.getRootNav().push(tabsPage);
          } else {
            console.log("TabsPage not exists");
            this.app.getRootNav().push(TabsPage);
          }
        }
      });
    });
  }

  callApiProfileUpdate() {
    console.log("Update profile:", this.registerForm.value);
    // Call backend UpdateProfile API
    this.authService.updateProfile(this.registerForm.value).subscribe(response => {
      if (response.result === "OK") {
        // construct user data
        let userData = {
          id: this.registerForm.controls["id"].value,
          title: this.registerForm.controls["title"].value,
          avatar: this.registerForm.controls["avatar"].value,
          fullName: this.registerForm.controls["fullName"].value,
          email: this.registerForm.controls["email"].value,
          company: this.registerForm.controls["company"].value,
          country: this.registerForm.controls["country"].value,
          position: this.registerForm.controls["position"].value,
          mobile: this.registerForm.controls["mobile"].value,
          notifByEmail: this.registerForm.controls["notifByEmail"].value,
          notifBySms: this.registerForm.controls["notifBySms"].value,
          notifByPush: this.registerForm.controls["notifByPush"].value,
          about: ""
        };
        // put user"s data into globalVars
        this.globalVars.setValue("userData", userData);
      }
      // show toast
      let toast = this.toastCtrl.create({
        message: response.message,
        duration: 3000,
        position: "bottom"
      });
      toast.present().then(data => {
        if (response.result === "OK") {
          // go back to the user profile screen
          this.navCtrl.pop();
        }
      });
    });
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad RegisterPage");
  }


  selectAvatarSource() {
    let actionSheet = this.actionCtrl.create({
      title: "Select Source",
      buttons: [
        {
          text: "Camera",
          icon: "camera",
          handler: () => {
            let options = {
              sourceType: Camera.PictureSourceType.CAMERA,
              destinationType: Camera.DestinationType.DATA_URL
            };
            Camera.getPicture(options).then((imageData) => {
              this.registerForm.controls["avatar"].setValue("data:image/jpg;base64," + imageData);
            }, (err) => {
              let alert = this.alertCtrl.create({
                title: "Camera failed",
                subTitle: err,
                buttons: ['OK']
              });
              alert.present();
            });
          }
        }, {
          text: "Gallery",
          icon: "images",
          handler: () => {
            let options = {
              sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
              destinationType: Camera.DestinationType.FILE_URI
            };
            Camera.getPicture(options).then((imageData) => {
              this.registerForm.controls["avatar"].setValue(imageData);
            }, (err) => {
              let alert = this.alertCtrl.create({
                title: "Get Picture failed",
                subTitle: err,
                buttons: ['OK']
              });
              alert.present();
            });
          }
        }, {
          text: "Cancel",
          role: "cancel",
          icon: "undo",
          handler: () => {
            // do nothing
          }
        }
      ]
    });
    actionSheet.present();
  }


  viewDisclimer(subject: string) {
    event.preventDefault();
    event.stopPropagation();
    let disclimer = this.navCtrl.getViews().find(itm => itm.name === "DisclimerPage");
    if (disclimer) {
      this.navCtrl.push(disclimer, { subject: subject });
    } else {
      this.navCtrl.push(DisclimerPage, { subject: subject });
    }
  }
}


export const requireTrueValidator = (c: AbstractControl): { [key: string]: any } => {
  return c.value === true ? null : { requireTrueValidator: { valid: false } };
}