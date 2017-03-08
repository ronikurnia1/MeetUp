import { Component, ChangeDetectorRef } from "@angular/core";
import { Camera } from "ionic-native";
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl } from "@angular/forms";
import {
  App, NavController, NavParams, AlertController, ToastController,
  LoadingController, ActionSheetController
} from "ionic-angular";
import { TabsPage } from "../tabs/tabs"; import { DisclimerPage } from "../disclimer/disclimer";
import { GlobalVarsService } from "../../providers/global-vars-service";
import { AuthService } from "../../providers/auth-service";
import { CryptoService } from "../../providers/crypto-service";

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

  private countries: Array<any>;
  private industries: Array<any>;
  private technologies: Array<any>;
  private jobLevels: Array<any>;
  private jobRoles: Array<any>;
  private notifications: Array<any>;
  private titles: any;
  private submitAttempt: boolean = false;
  private screenTitle: string;
  private buttonTitle: string;
  private userType: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private app: App,
    private crypto: CryptoService,
    private formBuilder: FormBuilder,
    private globalVars: GlobalVarsService,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private actionCtrl: ActionSheetController,
    private changeDetec: ChangeDetectorRef) {

    this.screenTitle = navParams.get("title");
    this.countries = navParams.get("countries");
    this.industries = navParams.get("industries");
    this.technologies = navParams.get("technologies");
    this.notifications = navParams.get("notifications");
    this.jobLevels = navParams.get("jobLevels");
    this.jobRoles = navParams.get("jobRoles");
    this.titles = navParams.get("titles");

    this.buttonTitle = this.screenTitle.toLowerCase() === "register" ? "Register" : "Save";

    this.submitAttempt = false;

    if (this.screenTitle.toLowerCase() === "register") {
      // build registration form
      this.registerForm = formBuilder.group({
        avatar: ["assets/icon/avatar.png"],
        titleTitle: [""],
        titleId: [""],
        fullName: ["", Validators.required],
        mobile: ["", Validators.required],
        email: ["", Validators.compose([Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])],
        password: ["", Validators.required],
        confirmPassword: ["", Validators.required],
        countryId: ["", Validators.required],
        countryTitle: [""],
        company: ["", Validators.required],
        userType: ["delegate"],
        isAdmin: [false],
        position: [""]
      });
      this.notifications.forEach(notif => {
        this.registerForm.addControl(notif.id, new FormControl(false));
      });
    } else {
      let profile = this.globalVars.getValue("userData");
      this.userType = profile.userType;
      console.log("user Type:", this.userType);
      // console.log("Profile:", profile);
      // build update user profile form
      this.registerForm = formBuilder.group({
        id: [profile.id],
        avatar: [profile.avatar || "assets/icon/avatar.png"],
        titleTitle: [profile.titleTitle],
        titleId: [profile.titleId],
        firstName: [profile.firstName, Validators.required],
        lastName: [profile.lastName, Validators.required],
        mobile: [profile.mobile, Validators.required],
        email: [profile.email, Validators.compose([Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)])],
        countryId: [profile.countryId, Validators.required],
        countryTitle: [profile.countryTitle],
        company: [profile.company, Validators.required],
        jobLevelId: [profile.jobLevelId],
        jobLevelTitle: [profile.jobLevelTitle],
        jobRoleId: [profile.jobRoleId],
        jobRoleTitle: [profile.jobRoleTitle],
        userType: [profile.userType],
        isAdmin: [profile.isAdmin],
        industryId: [profile.industryId],
        industryTitle: [profile.insudtryTitle],
        // TODO: please double check!
        techInterestId: [(profile.techInterestId || "").split(";")],
        notificationMethods: [profile.notificationMethods]
      });
      this.notifications.forEach(notif => {
        let value: boolean = false;
        if (profile.notificationMethods) {
          value = (<string>profile.notificationMethods).indexOf(notif.id) != -1;
        }
        this.registerForm.addControl(notif.id, new FormControl(value));
      });
    }
  }


  contryChange(event: any) {
    this.registerForm.controls["countryTitle"].setValue(this.countries.find(itm => itm.id === event).title);
    //console.log("Country", this.registerForm.controls["countryTitle"].value);
  }
  industryChange(event: any) {
    this.registerForm.controls["industryTitle"].setValue(this.industries.find(itm => itm.id === event).title);
  }
  jobRoleChange(event: any) {
    this.registerForm.controls["jobRoleTitle"].setValue(this.jobRoles.find(itm => itm.id === event).title);
  }
  jobLevelChange(event: any) {
    this.registerForm.controls["jobLevelTitle"].setValue(this.jobLevels.find(itm => itm.id === event).title);
  }
  titleChange(event: any) {
    this.registerForm.controls["titleTitle"].setValue(this.titles.find(itm => itm.id === event).title);
  }
  technologyChange(event: any) {
    // console.log("Data:", event);
    //this.registerForm.controls["technologyTitle"].setValue(this.technologies.find(itm => itm.id === event).title);
  }
  register() {
    event.preventDefault();
    event.stopPropagation();
    this.submitAttempt = true;
    console.log("Form Status:", this.registerForm.value);
    if (this.registerForm.valid) {
      if (this.screenTitle.toLowerCase() === "register") {
        this.callApiRegistration();
      } else {
        this.callApiProfileUpdate();
      }
    }
  }


  callApiRegistration() {
    //console.log("registration:", JSON.stringify(this.registerForm.value));
    // Call backend Registration API
    let userData = this.getFormValue(this.registerForm);
    this.authService.registerUser(userData).subscribe(response => {
      if (response.result === "OK") {
        // put user"s data into globalVars
        userData["id"] = response.userId;
        this.globalVars.setValue("userData", this.registerForm.value);
      }
      // show toast
      let toast = this.toastCtrl.create({
        message: response.message,
        duration: 3000,
        position: "bottom"
      });
      toast.present().then(data => {
        if (response.result === "OK") {
          // reset the form
          this.submitAttempt = false;
          this.registerForm.reset();

          // call detectChanges to prevent issue:
          // "Expression has changed after it was checked."
          this.changeDetec.detectChanges();

          // Redirect to my schedule page
          // check if Tabs already exist
          let tabsPage = this.app.getRootNav().getViews().find(itm => itm.name === "TabsPage") || TabsPage;
          this.app.getRootNav().push(tabsPage);
        }
      });
    });
  }

  callApiProfileUpdate() {
    // console.log("Update profile:", this.registerForm.value);
    // Call backend UpdateProfile API
    let userData = this.getFormValue(this.registerForm);

    let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();

    this.authService.updateProfile(userData).subscribe(response => {
      loader.dismissAll();
      if (response.result === "OK") {
        // construct user data
        this.globalVars.setValue("userData", this.registerForm.value);
        if (localStorage.getItem("userData")) {
          // save encrypted user's data on storage
          // for remembering
          let encryptedUserData: string = this.crypto.encrypt(JSON.stringify(this.registerForm.value));
          localStorage.setItem("userData", encryptedUserData);
        }
      }
      // show toast
      let toast = this.toastCtrl.create({
        message: response.message || "Profile has been updated successfully.",
        duration: 3000,
        position: "bottom"
      });
      toast.present().then(data => {
        if (response.result === "OK") {
          // go back to the user profile screen
          this.navCtrl.pop();
        }
      });
    }, error => {
      loader.dismissAll();
      // show toast
      let toast = this.toastCtrl.create({
        message: error,
        duration: 3000,
        position: "bottom"
      });
      toast.present();
    });
  }

  getFormValue(form: FormGroup): any {
    let userData = {
      id: form.controls["id"].value,
      titleId: form.controls["titleId"].value,
      avatar: form.controls["avatar"].value,
      firstName: form.controls["firstName"].value,
      lastName: form.controls["lastName"].value,
      company: form.controls["company"].value,
      country: form.controls["countryId"].value,
      industryId: form.controls["industryId"].value,
      jobLevelId: form.controls["jobLevelId"].value,
      jobRoleId: form.controls["jobRoleId"].value,
      mobile: form.controls["mobile"].value,
      userType: form.controls["userType"].value,
      isAdmin: form.controls["isAdmin"].value,
      techInterestId: form.controls["techInterestId"].value.join(";"),
      about: ""
    };
    let notifValues: string = "";
    this.notifications.forEach(notif => {
      if (form.controls[notif.id].value) {
        notifValues += notif.id + ";";
      }
    });
    userData["notificationMethods"] = notifValues;
    // update the form as well
    form.controls["notificationMethods"].setValue(notifValues);
    form.controls["techInterestId"].setValue(userData.techInterestId);

    if (this.screenTitle.toLowerCase() === "register") {
      userData["password"] = form.controls["password"].value;
    }

    // console.log("Data", JSON.stringify(userData));
    return userData;
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
              console.log("Avatar:", this.registerForm.controls["avatar"].value);
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