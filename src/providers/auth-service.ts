import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { GlobalVarsService } from "./global-vars-service";
import "rxjs/Rx";

/**
 * This class provide authentication service
 */
@Injectable()
export class AuthService {
  constructor(private http: Http, public globalVars: GlobalVarsService) { }

  /**
   * Register user
   */
  registerUser(registrationData: any): Observable<any> {
    // TODO:
    // return this.http.post(this.globalVars.getValue("apiUrl") + "RegisterUser", registrationData)
    //   .map((response: Response) => response.json()).catch(this.handleError);
    return this.http.get(this.globalVars.getValue("apiUrl") + "dummy-data/register-user.json")
      .map((response: Response) => response.json()).catch(this.handleError);
  }

  /**
   * Register user
   */
  changePassword(changePassword: any): Observable<any> {
    // TODO:
    // return this.http.post(this.globalVars.getValue("apiUrl") + "ChangePassword", changePassword)
    //   .map((response: Response) => response.json()).catch(this.handleError);
    return this.http.get(this.globalVars.getValue("apiUrl") + "dummy-data/change-password.json")
      .map((response: Response) => response.json()).catch(this.handleError);
  }

  /**
 * Get profile
 */
  getProfile(profileId: string): Observable<any> {
    let request = "dummy-data/get-profile.json"
    // TODO:
    // let request = "GetProfile?id=" + profileId;
    // return this.http.get(this.globalVars.getValue("apiUrl") + request)
    //     .map((response: Response) => { response.json() }).catch(this.handleError);
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
    // let data = { email: email, password: password };
    // return this.http.post(this.globalVars.getValue("apiUrl") + "login", data)
    //   .map((response: Response) => response.json()).catch(this.handleError);

    let responseFile = email.toLowerCase().indexOf("admin") > -1 ?
      "login-admin.json" : "login-exhibitor.json";
    return this.http.get(this.globalVars.getValue("apiUrl") + "dummy-data/" + responseFile)
      .map((response: Response) => response.json()).catch(this.handleError);
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
    let request = "dummy-data/disclimer.json"
    // TODO:
    // return this.http.get(this.globalVars.getValue("apiUrl") + request)
    //     .map((response: Response) => { response.json() }).catch(this.handleError);
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
