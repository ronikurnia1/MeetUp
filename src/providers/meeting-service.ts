import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { GlobalVarsService } from "./global-vars-service";
import { Meeting } from "../domain/meeting";
import "rxjs/Rx";

/**
 * This class provides the meeting services
 */
@Injectable()
export class MeetingService {

    constructor(private http: Http,
        private globalVars: GlobalVarsService) { }


    /**
     * get users based on given group & keywords
     */
    getUsers(group?: string, keywords?: string): Observable<any[]> {
        // TODO:
        let groupQuery = group ? "?group=" + group : "";
        let queryString = groupQuery ? (keywords ? "&keywords=" + keywords : "")
            : (keywords ? "?keywords=" + keywords : "");

        let request = "GetUsers" + queryString;
        // return this.http.get(this.globalVars.getValue("apiUrl") + request)
        //     .map((response: Response) => { response.json() }).catch(this.handleError);
        return this.http.get(this.globalVars.getValue("apiUrl") + "dummy-data/get-users.json")
            .map((response: Response) => response.json()).catch(this.handleError);
    }

    /**
     * get meeting locations
     */
    getLocations(): Observable<any[]> {
        // TODO:
        // return this.http.get(this.globalVars.getValue("apiUrl") + "/GetLocations")
        //     .map((response: Response) => { response.json() }).catch(this.handleError);
        return this.http.get(this.globalVars.getValue("apiUrl") + "dummy-data/get-locations.json")
            .map((response: Response) => response.json()).catch(this.handleError);
    }


    /**
     * get meeting locations
     */
    getSubjects(): Observable<any[]> {
        // TODO:
        // return this.http.get(this.globalVars.getValue("apiUrl") + "/GetSubjects")
        //     .map((response: Response) => { response.json() }).catch(this.handleError);
        return this.http.get(this.globalVars.getValue("apiUrl") + "dummy-data/get-subjects.json")
            .map((response: Response) => response.json()).catch(this.handleError);
    }


    /**
     * get chat list
     */
    getChatList(email: string): Observable<any> {
        // TODO:
        let request = "GetChatList?email=" + email;
        // return this.http.get(this.globalVars.getValue("apiUrl") + request)
        //     .map((response: Response) => { response.json() }).catch(this.handleError);
        return this.http.get(this.globalVars.getValue("apiUrl") + "dummy-data/get-chat-list.json")
            .map((response: Response) => response.json()).catch(this.handleError);
    }

    /**
     * get today's meeting data of certain userName
     */
    getMeetings(userEmail: string, type: string): Observable<any[]> {
        // TODO:
        // let request = "GetMeetings?type=" + type + "&email=" + userEmail;
        // return this.http.get(this.globalVars.getValue("apiUrl") + request)
        //     .map((response: Response) => { response.json() }).catch(this.handleError);
        return this.http.get(this.globalVars.getValue("apiUrl") + "dummy-data/today-meetings.json")
            .map((response: Response) => response.json()).catch(this.handleError);
    }

    /**
     * get meeting details by id
     */
    getMeetingById(meetingId: string): Observable<any> {
        // TODO:
        // let request = "GetMeetingById?id=" + meetingId;
        // return this.http.get(this.globalVars.getValue("apiUrl") + request)
        //     .map((response: Response) => { response.json() }).catch(this.handleError);
        return this.http.get(this.globalVars.getValue("apiUrl") + "dummy-data/get-meeting-by-id.json")
            .map((response: Response) => response.json()).catch(this.handleError);
    }

    /**
     * Send meeting invitation
     */
    sendInvitation(invitaion: any): Observable<any> {
        // TODO:
        // let data = { meetingid: meetingId, recipientemail: userEmail, statusname: "accepted" };
        // return this.http.post(this.globalVars.getValue("apiUrl") + "SendInvitaion", invitaion)
        //     .map((response: Response) => { response.json() }).catch(this.handleError);
        return this.http.get(this.globalVars.getValue("apiUrl") + "dummy-data/send-invitation.json")
            .map((response: Response) => response.json()).catch(this.handleError);
    }

    /**
     * Accept meeting invitation
     */
    acceptInvitation(meetingId: string,
        userEmail: string): Observable<any> {
        // TODO:
        // let data = { meetingId: meetingId, recipientEmail: userEmail, statusName: "accepted" };
        // return this.http.post(this.globalVars.getValue("apiUrl") + "UpdateStatusMeeting", data)
        //     .map((response: Response) => { response.json() }).catch(this.handleError);
        return this.http.get(this.globalVars.getValue("apiUrl") + "dummy-data/accept-invitation.json")
            .map((response: Response) => response.json()).catch(this.handleError);
    }
    /**
     * Reschedule meeting invitation
     */
    rescheduleMeeting(rescheduleData: any): Observable<any> {
        // TODO:
        // return this.http.post(this.globalVars.getValue("apiUrl") + "UpdateStatusMeeting", rescheduleData)
        //     .map((response: Response) => { response.json() }).catch(this.handleError);
        return this.http.get(this.globalVars.getValue("apiUrl") + "dummy-data/reschedule-meeting.json")
            .map((response: Response) => response.json()).catch(this.handleError);
    }
    /**
     * Reject/Decline meeting invitation
     */
    declineInvitation(meetingId: string, userEmail: string, reason: string): Observable<any> {
        // TODO:
        // let data = {
        //     meetingid: meetingId,
        //     recipientemail: userEmail,
        //     statusname: "rejected",
        //     reason: reason
        // };
        // return this.http.post(this.globalVars.getValue("apiUrl") + "UpdateStatusMeeting", data)
        //     .map((response: Response) => { response.json() }).catch(this.handleError);
        return this.http.get(this.globalVars.getValue("apiUrl") + "dummy-data/decline-invitation.json")
            .map((response: Response) => response.json()).catch(this.handleError);
    }

    /**
     * Cancel My Meeting
     */
    cancelMeeting(meetingId: string, reason: string): Observable<any> {
        // TODO:
        // let data = { meetingId: meetingId, reason: reason };
        // return this.http.post(this.globalVars.getValue("apiUrl") + "CancelMyMeeting", data)
        //     .map((response: Response) => { response.json() }).catch(this.handleError);
        return this.http.get(this.globalVars.getValue("apiUrl") + "dummy-data/cancel-meeting.json")
            .map((response: Response) => response.json()).catch(this.handleError);
    }
    /**
     * Withdraw accepted meeting 
     */
    withdrawAcceptedMeeting(meetingId: string,
        userEmail: string, reason: string): Observable<any> {
        // TODO:
        // let data = {
        //     meetingid: meetingId,
        //     recipientemail: userEmail,
        //     statusname: "withdrawed",
        //     reason: reason
        // };
        // return this.http.post(this.globalVars.getValue("apiUrl") + "UpdateStatusMeeting", data)
        //     .map((response: Response) => { response.json() }).catch(this.handleError);
        return this.http.get(this.globalVars.getValue("apiUrl") + "dummy-data/withdraw-accepted-meeting.json")
            .map((response: Response) => response.json()).catch(this.handleError);
    }

    /**
     * Save attendance registration
     */
    saveAttendanceRegistration(profile: any): Observable<any> {
        // TODO:
        // return this.http.post(this.globalVars.getValue("apiUrl") + "SaveAttendanceRegistration", profile)
        //     .map((response: Response) => { response.json() }).catch(this.handleError);
        return this.http.get(this.globalVars.getValue("apiUrl") + "dummy-data/save-attendance-registration.json")
            .map((response: Response) => response.json()).catch(this.handleError);
    }

    /**
     * Create Block time
     */
    createBlockTime(blockTime: any) {
        console.log("blocktime:", blockTime);
        // TODO:
        // return this.http.post(this.globalVars.getValue("apiUrl") + "UpdateBlcokTime", blockTime)
        //     .map((response: Response) => { response.json() }).catch(this.handleError);
        return this.http.get(this.globalVars.getValue("apiUrl") + "dummy-data/create-blocktime.json")
            .map((response: Response) => response.json()).catch(this.handleError);
    }
    /**
     * Update Block time
     */
    updateBlockTime(blockTime: any): Observable<any> {
        // console.log("blocktime:", blockTime);
        // TODO:
        // return this.http.post(this.globalVars.getValue("apiUrl") + "UpdateBlcokTime", blockTime)
        //     .map((response: Response) => { response.json() }).catch(this.handleError);
        return this.http.get(this.globalVars.getValue("apiUrl") + "dummy-data/update-blocktime.json")
            .map((response: Response) => response.json()).catch(this.handleError);
    }

    /**
     * Remove Block time
     */
    removeBlockTime(blockTime: any): Observable<any> {
        // console.log("blocktime:", blockTime);
        // TODO:
        // return this.http.post(this.globalVars.getValue("apiUrl") + "RemoveBlcokTime", blockTime)
        //     .map((response: Response) => { response.json() }).catch(this.handleError);
        return this.http.get(this.globalVars.getValue("apiUrl") + "dummy-data/remove-blocktime.json")
            .map((response: Response) => response.json()).catch(this.handleError);
    }


    submitScanedBadge(scanedBadge: any) {
        // TODO:
        // return this.http.post(this.globalVars.getValue("apiUrl") + "SubmitScanedBadge", scanedBadge)
        //     .map((response: Response) => { response.json() }).catch(this.handleError);
        return this.http.get(this.globalVars.getValue("apiUrl") + "dummy-data/submit-scaned-badge.json")
            .map((response: Response) => response.json()).catch(this.handleError);
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

    /**
    * Helper for building meeting object
    */
    public buildMeeting(rawData: any): Meeting {
        return new Meeting(
            rawData.id,
            rawData.subject,
            rawData.type,
            rawData.location,
            rawData.date,
            rawData.time,
            rawData.meetingWith,
            rawData.status,
            rawData.remarks);
    }


}