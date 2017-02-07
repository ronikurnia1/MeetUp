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
    getUsers(keyword: string): Observable<any> {
        // TODO:
        let queryString = "?userId=" + this.globalVars.getValue("userData").id
            + "&keyword=" + keyword;
        let request = "MobileMeetingApi/GetEventUsers" + queryString;
        return this.http.get(this.globalVars.getValue("apiUrl") + request)
            .map((response: Response) => response.json()).catch(this.handleError);
        // return this.http.get(this.globalVars.getValue("apiUrlDummy") + "dummy-data/get-users.json")
        //     .map((response: Response) => response.json()).catch(this.handleError);
    }


    /**
     * get users for chatting
     */
    getUsersForChat(userTypeId: string, industryId: string, keyword: string): Observable<any> {
        // TODO:
        let queryString = "?userId=" + this.globalVars.getValue("userData").id +
            "&userTypeId=" + userTypeId + "&industryId=" + industryId + "&keyword=" + keyword;
        let request = "MobileUserApi/GetUsersChat" + queryString;
        return this.http.get(this.globalVars.getValue("apiUrl") + request)
            .map((response: Response) => response.json()).catch(this.handleError);
        // return this.http.get(this.globalVars.getValue("apiUrlDummy") + "dummy-data/get-users.json")
        //     .map((response: Response) => response.json()).catch(this.handleError);
    }


    /**
     * get meeting locations
     */
    getLocations(): Observable<any> {
        // TODO:
        return this.http.get(this.globalVars.getValue("apiUrl") + "MobileMeetingApi/GetLocations")
            .map((response: Response) => response.json()).catch(this.handleError);
        // return this.http.get(this.globalVars.getValue("apiUrlDummy") + "dummy-data/get-locations.json")
        //     .map((response: Response) => response.json()).catch(this.handleError);
    }


    /**
     * get meeting locations
     */
    getSubjects(): Observable<any> {
        // TODO:
        return this.http.get(this.globalVars.getValue("apiUrl") + "MobileMeetingApi/GetAllMeetings")
            .map((response: Response) => response.json()).catch(this.handleError);
        // return this.http.get(this.globalVars.getValue("apiUrlDummy") + "dummy-data/get-subjects.json")
        //     .map((response: Response) => response.json()).catch(this.handleError);
    }


    /**
     * get chat list
     */
    getChatList(email: string): Observable<any> {
        // TODO:
        // let request = "GetChatList?email=" + email;
        // return this.http.get(this.globalVars.getValue("apiUrlDummy") + request)
        //     .map((response: Response) => response.json()).catch(this.handleError);
        return this.http.get(this.globalVars.getValue("apiUrlDummy") + "dummy-data/get-chat-list.json")
            .map((response: Response) => response.json()).catch(this.handleError);
    }

    /**
     * get today's meeting data of certain userName
     */
    getMeetings(userEmail: string, type: string): Observable<any> {
        // TODO:
        // let request = "GetMeetings?type=" + type + "&email=" + userEmail;
        // return this.http.get(this.globalVars.getValue("apiUrlDummy") + request)
        //     .map((response: Response) => response.json()).catch(this.handleError);
        return this.http.get(this.globalVars.getValue("apiUrlDummy") + "dummy-data/today-meetings.json")
            .map((response: Response) => response.json()).catch(this.handleError);
    }


    /**
     * get today's meeting data of certain userName
     */
    getNotifications(userEmail: string): Observable<any> {
        // TODO:
        // let request = "GetNotifications?email=" + userEmail;
        // return this.http.get(this.globalVars.getValue("apiUrlDummy") + request)
        //     .map((response: Response) => response.json()).catch(this.handleError);
        return this.http.get(this.globalVars.getValue("apiUrlDummy") + "dummy-data/get-notifications.json")
            .map((response: Response) => response.json()).catch(this.handleError);
    }


    /**
     * get meeting details by id
     */
    getMeetingById(meetingId: string): Observable<any> {
        // TODO:
        // let request = "GetMeetingById?id=" + meetingId;
        // return this.http.get(this.globalVars.getValue("apiUrlDummy") + request)
        //     .map((response: Response) => response.json()).catch(this.handleError);
        return this.http.get(this.globalVars.getValue("apiUrlDummy") + "dummy-data/get-meeting-by-id.json")
            .map((response: Response) => response.json()).catch(this.handleError);
    }

    /**
     * Send meeting invitation
     */
    sendInvitation(invitation: any): Observable<any> {
        // TODO:
        let data = {
            startTime: invitation.date + " " + invitation.startTime,
            endTime: invitation.date + " " + invitation.endTime,
            subject: invitation.subject === "Other" ? invitation.customSubject : invitation.subject,
            initiatorEmail: this.globalVars.getValue("userData").email,
            locationId: invitation.location,
            recipientEmails: invitation.recipient.email,
            remarks: invitation.remarks
        };
        //console.log("Data:", JSON.stringify(data));

        return this.http.post(this.globalVars.getValue("apiUrl") + "MobileMeetingApi/CreateMeeting", data)
            .map((response: Response) => response.json()).catch(this.handleError);
        // return this.http.get(this.globalVars.getValue("apiUrlDummy") + "dummy-data/send-invitation.json")
        //     .map((response: Response) => response.json()).catch(this.handleError);
    }

    /**
     * Accept meeting invitation
     */
    acceptInvitation(meetingId: string,
        userEmail: string): Observable<any> {
        // TODO:
        // let data = { meetingId: meetingId, recipientEmail: userEmail, statusName: "accepted" };
        // return this.http.post(this.globalVars.getValue("apiUrlDummy") + "UpdateStatusMeeting", data)
        //     .map((response: Response) => response.json()).catch(this.handleError);
        return this.http.get(this.globalVars.getValue("apiUrlDummy") + "dummy-data/accept-invitation.json")
            .map((response: Response) => response.json()).catch(this.handleError);
    }
    /**
     * Reschedule meeting invitation
     */
    rescheduleMeeting(rescheduleData: any): Observable<any> {
        // TODO:
        // return this.http.post(this.globalVars.getValue("apiUrlDummy") + "UpdateStatusMeeting", rescheduleData)
        //     .map((response: Response) => response.json()).catch(this.handleError);
        return this.http.get(this.globalVars.getValue("apiUrlDummy") + "dummy-data/reschedule-meeting.json")
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
        // return this.http.post(this.globalVars.getValue("apiUrlDummy") + "UpdateStatusMeeting", data)
        //     .map((response: Response) => response.json()).catch(this.handleError);
        return this.http.get(this.globalVars.getValue("apiUrlDummy") + "dummy-data/decline-invitation.json")
            .map((response: Response) => response.json()).catch(this.handleError);
    }

    /**
     * Cancel My Meeting
     */
    cancelMeeting(meetingId: string, reason: string): Observable<any> {
        // TODO:
        // let data = { meetingId: meetingId, reason: reason };
        // return this.http.post(this.globalVars.getValue("apiUrlDummy") + "CancelMyMeeting", data)
        //     .map((response: Response) => response.json()).catch(this.handleError);
        return this.http.get(this.globalVars.getValue("apiUrlDummy") + "dummy-data/cancel-meeting.json")
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
        // return this.http.post(this.globalVars.getValue("apiUrlDummy") + "UpdateStatusMeeting", data)
        //     .map((response: Response) => response.json()).catch(this.handleError);
        return this.http.get(this.globalVars.getValue("apiUrlDummy") + "dummy-data/withdraw-accepted-meeting.json")
            .map((response: Response) => response.json()).catch(this.handleError);
    }

    /**
     * Save attendance registration
     */
    saveAttendanceRegistration(profile: any): Observable<any> {
        // TODO:
        // return this.http.post(this.globalVars.getValue("apiUrlDummy") + "SaveAttendanceRegistration", profile)
        //     .map((response: Response) => response.json()).catch(this.handleError);
        return this.http.get(this.globalVars.getValue("apiUrlDummy") + "dummy-data/save-attendance-registration.json")
            .map((response: Response) => response.json()).catch(this.handleError);
    }

    /**
     * Create Block time
     */
    createBlockTime(blockTime: any) {
        // TODO:
        // return this.http.post(this.globalVars.getValue("apiUrlDummy") + "UpdateBlcokTime", blockTime)
        //     .map((response: Response) => response.json()).catch(this.handleError);
        return this.http.get(this.globalVars.getValue("apiUrlDummy") + "dummy-data/create-blocktime.json")
            .map((response: Response) => response.json()).catch(this.handleError);
    }
    /**
     * Update Block time
     */
    updateBlockTime(blockTime: any): Observable<any> {
        // console.log("blocktime:", blockTime);
        // TODO:
        // return this.http.post(this.globalVars.getValue("apiUrlDummy") + "UpdateBlcokTime", blockTime)
        //     .map((response: Response) => response.json()).catch(this.handleError);
        return this.http.get(this.globalVars.getValue("apiUrlDummy") + "dummy-data/update-blocktime.json")
            .map((response: Response) => response.json()).catch(this.handleError);
    }

    /**
     * Remove Block time
     */
    removeBlockTime(blockTime: any): Observable<any> {
        // console.log("blocktime:", blockTime);
        // TODO:
        // return this.http.post(this.globalVars.getValue("apiUrlDummy") + "RemoveBlcokTime", blockTime)
        //     .map((response: Response) => response.json()).catch(this.handleError);
        return this.http.get(this.globalVars.getValue("apiUrlDummy") + "dummy-data/remove-blocktime.json")
            .map((response: Response) => response.json()).catch(this.handleError);
    }


    submitScanedBadge(scanedBadge: any) {
        // TODO:
        // return this.http.post(this.globalVars.getValue("apiUrlDummy") + "SubmitScanedBadge", scanedBadge)
        //     .map((response: Response) => response.json()).catch(this.handleError);
        return this.http.get(this.globalVars.getValue("apiUrlDummy") + "dummy-data/submit-scaned-badge.json")
            .map((response: Response) => response.json()).catch(this.handleError);
    }


    /**
     * Get message list
     */
    getMessageList() {
        // TODO:
        // let request = "GetMessageList";
        // return this.http.get(this.globalVars.getValue("apiUrlDummy") + request)
        //     .map((response: Response) => response.json()).catch(this.handleError);
        return this.http.get(this.globalVars.getValue("apiUrlDummy") + "dummy-data/get-messages.json")
            .map((response: Response) => response.json()).catch(this.handleError);
    }

    /**
     * Get message details by id
     */
    getMessageById(messageId: string) {
        // TODO:
        // let request = "GetMessages?id=" + messageId;
        // return this.http.get(this.globalVars.getValue("apiUrlDummy") + request)
        //     .map((response: Response) => response.json()).catch(this.handleError);
        return this.http.get(this.globalVars.getValue("apiUrlDummy") + "dummy-data/get-message-details.json")
            .map((response: Response) => response.json()).catch(this.handleError);
    }

    /**
     * Post meeting survey
     */
    portMeetingSurvey(meetingFeeback: any): Observable<any> {
        // TODO:
        // return this.http.post(this.globalVars.getValue("apiUrlDummy") + "PostMeetingSurvey", meetingFeeback)
        //     .map((response: Response) => response.json()).catch(this.handleError);
        return this.http.get(this.globalVars.getValue("apiUrlDummy") + "dummy-data/post-metting-survey.json")
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