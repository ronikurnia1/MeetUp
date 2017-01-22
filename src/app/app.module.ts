import { NgModule, ErrorHandler } from "@angular/core";
import { IonicApp, IonicModule, IonicErrorHandler } from "ionic-angular";
import { MyApp } from "./app.component";
import { MomentModule } from "angular2-moment";
import { Ionic2RatingModule } from "ionic2-rating";
//import { Storage } from "@ionic/storage";
import { QRCodeModule } from "angular2-qrcode";

import { EqualValidator } from "../providers/equal-validator";
import { Elastic } from "../providers/elastic";

import { TabsPage } from "../pages/tabs/tabs";
import { LoginPage } from "../pages/login/login";
import { MySchedulePage } from "../pages/my-schedule/my-schedule";
import { MeetingDetailsPage } from "../pages/meeting-details/meeting-details";
import { MenuPage } from "../pages/menu/menu";
import { ScanAttendancePage } from "../pages/scan-attendance/scan-attendance";
import { MeetingTrackerPage } from "../pages/meeting-tracker/meeting-tracker";
import { CalendarViewPage } from "../pages/calendar-view/calendar-view";
import { ProviderModule } from "../providers/provider.module";
import { CancelOrDeclinePage } from "../pages/cancel-or-decline/cancel-or-decline";
import { RescheduleMeetingPage } from "../pages/reschedule-meeting/reschedule-meeting";
import { NotificationPage } from "../pages/notification/notification";
import { ChatPage } from "../pages/chat/chat";
import { RegisterPage } from "../pages/register/register";
import { DisclimerPage } from "../pages/disclimer/disclimer";
import { UserProfilePage } from "../pages/user-profile/user-profile";
import { PopoverPage } from "../pages/user-profile/popover";
import { ChangePasswordPage } from "../pages/change-password/change-password";
import { MyQrCodePage } from "../pages/my-qr-code/my-qr-code";
import { BlockTimePage } from "../pages/block-time/block-time";
import { PickUserPage } from "../pages/pick-user/pick-user";
import { ArrangeMeetingPage } from "../pages/arrange-meeting/arrange-meeting";
import { ScanBadgePage } from "../pages/scan-badge/scan-badge";
import { SaveAttendanceDataPage } from "../pages/save-attendance-data/save-attendance-data";
import { SendCommentPage } from "../pages/send-comment/send-comment";
import { PostMeetingSurveyPage } from "../pages/post-meeting-survey/post-meeting-survey";
import { ChatDetailsPage } from "../pages/chat-details/chat-details";
import { FindUserPage } from "../pages/find-user/find-user";
import { AdminArrangeMeetingPage } from "../pages/admin-arrange-meeting/admin-arrange-meeting";

// export function provideStorage() {
//   return new Storage(['sqlite', 'websql', 'indexeddb'], { name: '__mydb' })
// }

@NgModule({
  declarations: [
    Elastic,
    EqualValidator,
    MyApp,
    TabsPage,
    LoginPage,
    MySchedulePage,
    MeetingDetailsPage,
    MenuPage,
    ScanAttendancePage,
    MeetingTrackerPage,
    CalendarViewPage,
    CancelOrDeclinePage,
    RescheduleMeetingPage,
    NotificationPage,
    ChatPage,
    RegisterPage,
    DisclimerPage,
    UserProfilePage,
    PopoverPage,
    ChangePasswordPage,
    MyQrCodePage,
    BlockTimePage,
    PickUserPage,
    ArrangeMeetingPage,
    ScanBadgePage,
    SaveAttendanceDataPage,
    SendCommentPage,
    PostMeetingSurveyPage,
    ChatDetailsPage,
    FindUserPage,
    AdminArrangeMeetingPage
  ],
  imports: [
    IonicModule.forRoot(MyApp), Ionic2RatingModule,
    MomentModule, ProviderModule.forRoot(), QRCodeModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    LoginPage,
    MySchedulePage,
    MeetingDetailsPage,
    MenuPage,
    ScanAttendancePage,
    MeetingTrackerPage,
    CalendarViewPage,
    CancelOrDeclinePage,
    RescheduleMeetingPage,
    NotificationPage,
    ChatPage,
    RegisterPage,
    DisclimerPage,
    UserProfilePage,
    PopoverPage,
    ChangePasswordPage,
    MyQrCodePage,
    BlockTimePage,
    PickUserPage,
    ArrangeMeetingPage,
    ScanBadgePage,
    SaveAttendanceDataPage,
    SendCommentPage,
    PostMeetingSurveyPage,
    ChatDetailsPage,
    FindUserPage,
    AdminArrangeMeetingPage
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    //{ provide: Storage, useFactory: provideStorage }
  ]
})
export class AppModule { }
