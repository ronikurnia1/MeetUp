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
    getUsers(keyword: string, userType: string, pageIndex: number): Observable<any> {
        let queryString = "?userId=" + this.globalVars.getValue("userData").id + "&pageIndex=" + pageIndex + "&keyword=" + keyword;
        let request = "MobileMeetingApi/GetEventUsers" + queryString;
        return this.http.get(this.globalVars.getValue("apiUrl") + request)
            .map((response: Response) => {
                //localStorage.setItem("meetingUser", JSON.stringify(response.json()));
                let result: any = response.json();
                if (userType !== "all" && userType !== "") {
                    result.users = (result.users as any[]).filter(itm => {
                        return itm.userTypeName.toLowerCase() === userType.toLowerCase();
                    });
                }
                return result;
            }).catch(this.handleError);
        // return this.http.get(this.globalVars.getValue("apiUrlDummy") + "dummy-data/get-users.json")
        //     .map((response: Response) => response.json()).catch(this.handleError);
    }


    /**
     * get users for chatting
     */
    getUsersForChat(keyword: string, pageIndex: number): Observable<any> {
        let queryString = "?userId=" + this.globalVars.getValue("userData").id +
            "&pageIndex=" + pageIndex + "&userTypeId=&industryId=&keyword=" + keyword;
        let request = "MobileUserApi/GetUsersChat" + queryString;

        return this.http.get(this.globalVars.getValue("apiUrl") + request)
            .map((response: Response) => {
                return response.json();
            }).catch(this.handleError);

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
    getMeetings(userId: string, type: string): Observable<any> {
        // TODO:
        let request = "MobileMeetingApi/GetMeetingsByType?type=" + type + "&userId=" + userId;
        return this.http.get(this.globalVars.getValue("apiUrl") + request)
            .map((response: Response) => response.json()).catch(this.handleError);
        // return this.http.get(this.globalVars.getValue("apiUrlDummy") + "dummy-data/today-meetings.json")
        //     .map((response: Response) => response.json()).catch(this.handleError);
    }

    /**
     * get meeting's date
     */
    getMeetingDate(): Observable<any> {
        return this.http.get(this.globalVars.getValue("apiUrl") + "MobileMeetingApi/GetEventDates")
            .map((response: Response) => response.json()).catch(this.handleError);
        // return this.http.get(this.globalVars.getValue("apiUrlDummy") + "dummy-data/today-meetings.json")
        //     .map((response: Response) => response.json()).catch(this.handleError);
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
        let data = { meetingId: meetingId, byUserEmail: userEmail, statusName: "accepted" };
        return this.http.post(this.globalVars.getValue("apiUrl") + "MobileMeetingApi/UpdateMeetingStatus", data)
            .map((response: Response) => response.json()).catch(this.handleError);
        // return this.http.get(this.globalVars.getValue("apiUrlDummy") + "dummy-data/accept-invitation.json")
        //     .map((response: Response) => response.json()).catch(this.handleError);
    }
    /**
     * Reschedule meeting invitation
     */
    rescheduleMeeting(rescheduleData: any): Observable<any> {
        return this.http.post(this.globalVars.getValue("apiUrl") + "MobileMeetingApi/UpdateMeetingStatus", rescheduleData)
            .map((response: Response) => response.json()).catch(this.handleError);
        // return this.http.get(this.globalVars.getValue("apiUrlDummy") + "dummy-data/reschedule-meeting.json")
        //     .map((response: Response) => response.json()).catch(this.handleError);
    }
    /**
     * Reject/Decline meeting invitation
     */
    declineInvitation(meetingId: string, userEmail: string, reason: string): Observable<any> {
        let data = {
            meetingid: meetingId,
            byUserEmail: userEmail,
            statusName: "declined",
            reason: reason
        };
        return this.http.post(this.globalVars.getValue("apiUrl") + "MobileMeetingApi/UpdateMeetingStatus", data)
            .map((response: Response) => response.json()).catch(this.handleError);
        // return this.http.get(this.globalVars.getValue("apiUrlDummy") + "dummy-data/decline-invitation.json")
        //     .map((response: Response) => response.json()).catch(this.handleError);
    }

    /**
     * Cancel My Meeting
     */
    cancelMeeting(meetingId: string, reason: string): Observable<any> {
        let data = { meetingId: meetingId, reason: reason, byUserEmail: this.globalVars.getValue("userData").email };
        return this.http.post(this.globalVars.getValue("apiUrl") + "MobileMeetingApi/CancelMeeting", data)
            .map((response: Response) => response.json()).catch(this.handleError);
        // return this.http.get(this.globalVars.getValue("apiUrlDummy") + "dummy-data/cancel-meeting.json")
        //     .map((response: Response) => response.json()).catch(this.handleError);
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
        return this.http.post(this.globalVars.getValue("apiUrl") + "MobileUserApi/CreateBlockTime", blockTime)
            .map((response: Response) => response.json()).catch(this.handleError);
        // return this.http.get(this.globalVars.getValue("apiUrlDummy") + "dummy-data/create-blocktime.json")
        //     .map((response: Response) => response.json()).catch(this.handleError);
    }
    /**
     * Update Block time
     */
    updateBlockTime(blockTime: any): Observable<any> {
        return this.http.post(this.globalVars.getValue("apiUrl") + "MobileUserApi/UpdateBlockTime", blockTime)
            .map((response: Response) => response.json()).catch(this.handleError);
        // return this.http.get(this.globalVars.getValue("apiUrlDummy") + "dummy-data/update-blocktime.json")
        //     .map((response: Response) => response.json()).catch(this.handleError);
    }

    /**
     * Remove Block time
     */
    removeBlockTime(blockTimeId: string): Observable<any> {
        return this.http.get(this.globalVars.getValue("apiUrl") + "MobileUserApi/DeleteBlockTime?blockTimeId=" + blockTimeId)
            .map((response: Response) => response.json()).catch(this.handleError);
        // return this.http.get(this.globalVars.getValue("apiUrlDummy") + "dummy-data/remove-blocktime.json")
        //     .map((response: Response) => response.json()).catch(this.handleError);
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
        rawData["status"] = "pending";
        rawData["meetingWith"] = {};
        rawData.type = "meeting";
        return new Meeting(
            rawData.id,
            rawData.subject,
            rawData.type,
            rawData.meetingLocation,
            new Date("2017-02-16"),
            rawData.timeDisplay,
            rawData.meetingWith,
            rawData.status,
            rawData.remarks);
    }


}