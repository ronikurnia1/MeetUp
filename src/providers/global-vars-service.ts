import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/Rx";

/**
 * This class provide global variables service
 */
@Injectable()
export class GlobalVarsService {

    private config = {
        apiUrlDummy: "assets/",
        apiUrlProxy: "http://54.169.219.45:8090/api/",
        apiUrl: "/api/",
        firebaseUser: "roniku@gmail.com",
        firebasePwd: "St7465dsh!`+"
    };

    constructor(private http: Http) {

        // initialize config
        for (let itm in this.config) {
            this[itm] = this.config[itm];
        }
    }

    getValue(key: string): any {
        return this[key];
    }

    setValue(key: string, value: any) {
        this[key] = value;
    }

    // /**
    //  * initialize global variables
    //  */
    // initialize(): Observable<any> {
    //     return this.http.get("assets/config/app.json")
    //         .map((response: Response) => response.json()).catch(this.handleError);
    // }

    /**
     * get list of country
     */
    getCountries(): Observable<any> {
        return this.http.get(this["apiUrl"] + "MobileUserApi/GetContentRegister")
            .map((response: Response) => response.json()).catch(this.handleError);
        // return this.http.get(this["apiUrl"] + "dummy-data/get-content-register.json")
        //     .map((response: Response) => response.json()).catch(this.handleError);
    }

    getClassification(name: string): Observable<any> {
        return this.http.get(this["apiUrl"] + "MobileUserApi/GetClassification?name=" + name)
            .map((response: Response) => response.json()).catch(this.handleError);
    }

    getDataLookups(): Observable<any> {
        return Observable.forkJoin(
            this.http.get(this["apiUrl"] + "MobileUserApi/GetClassification?name=countries").map(res => {
                let data = res.json();
                data.name = "countries";
                return data;
            }),
            this.http.get(this["apiUrl"] + "MobileUserApi/GetClassification?name=industry-type").map(res => {
                let data = res.json();
                data.name = "industry-type";
                return data;
            }),
            this.http.get(this["apiUrl"] + "MobileUserApi/GetClassification?name=locations").map(res => {
                let data = res.json();
                data.name = "locations";
                return data;
            }),
            this.http.get(this["apiUrl"] + "MobileUserApi/GetClassification?name=notification-method").map(res => {
                let data = res.json();
                data.name = "notification-method";
                return data;
            }),
            this.http.get(this["apiUrl"] + "MobileUserApi/GetClassification?name=titles").map(res => {
                let data = res.json();
                data.name = "titles";
                return data;
            }),
            this.http.get(this["apiUrl"] + "MobileUserApi/GetClassification?name=area-of-technologies").map(res => {
                let data = res.json();
                data.name = "area-of-technologies";
                return data;
            }),
            this.http.get(this["apiUrl"] + "MobileUserApi/GetClassification?name=job-levels").map(res => {
                let data = res.json();
                data.name = "job-levels";
                return data;
            }),
            this.http.get(this["apiUrl"] + "MobileUserApi/GetClassification?name=job-roles").map(res => {
                let data = res.json();
                data.name = "job-roles";
                return data;
            })
        );
    }
    /**
    * Handle HTTP error
    */
    private handleError(error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }

}
