import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { AuthProviders, AngularFireAuth, FirebaseAuthState, AuthMethods, AngularFireDatabase } from "angularfire2";
import { Observable } from "rxjs/Observable";
import { GlobalVarsService } from "./global-vars-service";
import "rxjs/Rx";

/**
 * This class provide authentication service
 */
@Injectable()
export class AuthService {

  private authState: FirebaseAuthState;

  constructor(private http: Http,
    private auth$: AngularFireAuth,
    private db: AngularFireDatabase,
    private globalVars: GlobalVarsService) {
    this.authState = null;
    auth$.subscribe((state: FirebaseAuthState) => {
      this.authState = state;
    });
  }

  get authenticated(): boolean {
    return this.authState !== null;
  }

  loginToFirebase(): firebase.Promise<FirebaseAuthState> {
    let credential = { email: this.globalVars.getValue("firebaseUser"), password: this.globalVars.getValue("firebasePwd") };
    return this.auth$.login(credential, { provider: AuthProviders.Password, method: AuthMethods.Password });
  }

  logOutFromFirebase(): void {
    this.auth$.logout();
  }
  /**
   * Register user
   */
  registerUser(registrationData: any): Observable<any> {
    return this.http.post(this.globalVars.getValue("apiUrl") + "MobileUserApi/Register", registrationData)
      .map((response: Response) => {
        if (response.json().result === "OK") {
          this.authenticateUser(registrationData.email, registrationData.password).subscribe(authResponse => {
          });
        }
        return response.json();
      }).catch(this.handleError);
    // return this.http.get(this.globalVars.getValue("apiUrlDummy") + "dummy-data/register-user.json")
    //   .map((response: Response) => {
    //     this.authenticateUser(registrationData.email, registrationData.password).subscribe(authResponse => {
    //     });
    //     return response.json();
    //   }).catch(this.handleError);
  }

  /**
   * Register user
   */
  changePassword(changePassword: any): Observable<any> {
    // TODO:
    return this.http.post(this.globalVars.getValue("apiUrl") + "MobileUserApi/ChangePassword", changePassword)
      .map((response: Response) => response.json()).catch(this.handleError);
    // return this.http.get(this.globalVars.getValue("apiUrlDummy") + "dummy-data/change-password.json")
    //   .map((response: Response) => response.json()).catch(this.handleError);
  }

  /**
 * Get profile
 */
  getProfile(profileId: string): Observable<any> {
    // TODO:
    let request = "MobileUserApi/GetEventUserById?userId=" + profileId;
    return this.http.get(this.globalVars.getValue("apiUrl") + request)
        .map((response: Response) => response.json()).catch(this.handleError);
    // let request = "dummy-data/get-profile.json"
    // return this.http.get(this.globalVars.getValue("apiUrlDummy") + request)
    //   .map((response: Response) => response.json()).catch(this.handleError);
  }


  /**
   * Update profile
   */
  updateProfile(profileData: any): Observable<any> {
    // TODO:
    return this.http.post(this.globalVars.getValue("apiUrl") + "MobileUserApi/Update", profileData)
      .map((response: Response) => response.json()).catch(this.handleError);
    // return this.http.get(this.globalVars.getValue("apiUrlDummy") + "dummy-data/update-profile.json")
    //   .map((response: Response) => response.json()).catch(this.handleError);
  }

  /**
   * Authenticate user
   */
  authenticateUser(email: string, password: string): Observable<any> {
    let data = {
      email: email,
      password: password
    };
    return this.http.post(this.globalVars.getValue("apiUrl") + "MobileUserApi/Login", data)
      .map((response: Response) => {
        // If OK then login/signUp to Firebase        
        if (response.json().result === "OK") {
          this.loginToFirebase().then((result) => {
            console.log("Firebase authenticated:", this.authenticated);
          }, (error) => {
            console.log("Firebase login error:", error.message);
          });
        }
        return response.json();
      }).catch(this.handleError);

    // let responseFile = email.toLowerCase().indexOf("admin") > -1 ?
    //   "login-admin.json" : "login-exhibitor.json";
    // return this.http.get(this.globalVars.getValue("apiUrlDummy") + "dummy-data/" + responseFile)
    //   .map((response: Response) => {
    //     // If OK then login/signUp to Firebase        
    //     if (response.json().result === "OK") {
    //       this.loginToFirebase().then((result) => {
    //         console.log("Firebase authenticated:", this.authenticated);
    //       }, (error) => {
    //         console.log("Firebase login error:", error.message);
    //       });
    //     }
    //     return response.json();
    //   }).catch(this.handleError);
  }

  /**
   * Reset password
   */
  resetPassword(email: string): Observable<any> {
    // TODO:
    // return this.http.post(this.globalVars.getValue("apiUrl") + "MobileUserApi/ForgotPassword", { email: email })
    //   .map((response: Response) => response.json()).catch(this.handleError);
    return this.http.get(this.globalVars.getValue("apiUrlDummy") + "dummy-data/forgetpassword.json")
      .map((response: Response) => response.json()).catch(this.handleError);
  }


  /**
   * Get Disclimer
   */
  getDisclimer(subject: string): Observable<any> {
    // TODO:
    let request = subject === "terms" ? "MobileUserApi/GetTermsOfService" : "MobileUserApi/GetPrivacyPolicy";
    return this.http.get(this.globalVars.getValue("apiUrl") + request)
      .map((response: Response) => response.json()).catch(this.handleError);
    // let request = "dummy-data/disclimer.json"
    // return this.http.get(this.globalVars.getValue("apiUrlDummy") + request)
    //   .map((response: Response) => response.json()).catch(this.handleError);
  }
  /**
  * Handle HTTP error
  */
  private handleError(error: any) {
    console.log("error:", error);
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }

}
