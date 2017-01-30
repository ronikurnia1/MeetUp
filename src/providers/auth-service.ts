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

  signInWithPassword(email: string, password: string): firebase.Promise<FirebaseAuthState> {
    let credential = { email: email, password: password };
    return this.auth$.login(credential, { provider: AuthProviders.Password, method: AuthMethods.Password });
  }

  signUp(email: string, password: string): firebase.Promise<FirebaseAuthState> {
    return this.auth$.createUser({ email: email, password: password });
  }

  signOut(): void {
    this.auth$.logout();
  }
  /**
   * Register user
   */
  registerUser(registrationData: any): Observable<any> {
    // TODO:
    // return this.http.post(this.globalVars.getValue("apiUrl") + "Register", registrationData)
    //   .map((response: Response) => response.json()).catch(this.handleError);
    return this.http.get(this.globalVars.getValue("apiUrl") + "dummy-data/register-user.json")
      .map((response: Response) => {
        this.authenticateUser(registrationData.email, registrationData.password).subscribe(authResponse => {
        });
        return response.json();
      }).catch(this.handleError);
  }

  /**
   * Register user
   */
  changePassword(changePassword: any): Observable<any> {
    // TODO:
    return this.http.post(this.globalVars.getValue("apiUrl") + "ChangePassword", changePassword)
      .map((response: Response) => response.json()).catch(this.handleError);
    // return this.http.get(this.globalVars.getValue("apiUrl") + "dummy-data/change-password.json")
    //   .map((response: Response) => response.json()).catch(this.handleError);
  }

  /**
 * Get profile
 */
  getProfile(profileId: string): Observable<any> {
    // TODO:
    // let request = "GetProfile?id=" + profileId;
    // return this.http.get(this.globalVars.getValue("apiUrl") + request)
    //     .map((response: Response) => response.json()).catch(this.handleError);
    let request = "dummy-data/get-profile.json"
    return this.http.get(this.globalVars.getValue("apiUrl") + request)
      .map((response: Response) => response.json()).catch(this.handleError);
  }


  /**
   * Update profile
   */
  updateProfile(profileData: any): Observable<any> {
    // TODO:
    // return this.http.post(this.globalVars.getValue("apiUrl") + "UpdateProfile", profileData)
    //   .map((response: Response) => response.json()).catch(this.handleError);
    return this.http.get(this.globalVars.getValue("apiUrl") + "dummy-data/update-profile.json")
      .map((response: Response) => response.json()).catch(this.handleError);
  }

  /**
   * Authenticate user
   */
  authenticateUser(email: string, password: string): Observable<any> {
    // TODO:
    // return this.http.get("/api/Login?email=" + email + "&password=" + password)
    //   .map((response: Response) => response.json()).catch(this.handleError);

    let responseFile = email.toLowerCase().indexOf("admin") > -1 ?
      "login-admin.json" : "login-exhibitor.json";
    return this.http.get(this.globalVars.getValue("apiUrl") + "dummy-data/" + responseFile)
      .map((response: Response) => {
        // If OK then login/signUp to Firebase        
        if (response.json().result === "OK") {
          this.signInWithPassword("roniku@gmail.com", "StartNewDay!").then((result) => {
            console.log("Firebase authenticated:", this.authenticated);
          }, (error) => {
            console.log("Firebase login error:", error.message);
            // Sign up to firebase
            // this.signUp(email, password).then((a) => {
            //   console.log("Firebase authenticated:", this.authenticated);
            //   this.db.object("users/" + response.json().userProfile.id).set({
            //     avatar: response.json().userProfile.avatar,
            //     fullName: response.json().userProfile.fullName,
            //     chats: { dummy: true }
            //   });
            //   // a.auth.updateProfile({ displayName: response.json().userProfile.fullName, photoURL: response.json().userProfile.avatar });
            // }, (signUperror) => {
            //   console.log("error:", signUperror.message);
            // });
          });
        }
        return response.json();
      }).catch(this.handleError);
  }

  /**
   * Reset password
   */
  resetPassword(email: string): Observable<any> {
    // TODO:
    // return this.http.post(this.globalVars.getValue("apiUrl") + "ForgotPassword", { email: email })
    //   .map((response: Response) => response.json()).catch(this.handleError);
    return this.http.get(this.globalVars.getValue("apiUrl") + "dummy-data/forgetpassword.json")
      .map((response: Response) => response.json()).catch(this.handleError);
  }


  /**
   * Get Disclimer
   */
  getDisclimer(subject: string): Observable<any> {
    // TODO:
    // let request = subject === "terms" ? "GetTermsOfService" : "GetPrivacyPolicy";
    // return this.http.get(this.globalVars.getValue("apiUrl") + request)
    //   .map((response: Response) => response.json()).catch(this.handleError);
    let request = "dummy-data/disclimer.json"
    return this.http.get(this.globalVars.getValue("apiUrl") + request)
      .map((response: Response) => response.json()).catch(this.handleError);
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
