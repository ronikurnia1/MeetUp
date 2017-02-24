import { NgModule, ErrorHandler } from "@angular/core";
import { IonicApp, IonicModule, IonicErrorHandler } from "ionic-angular";
import { MyApp } from "./app.component";
import { MomentModule } from "angular2-moment";
import { Ionic2RatingModule } from "ionic2-rating";
//import { Storage } from "@ionic/storage";
import { AngularFireModule } from "angularfire2";
import { QRCodeModule } from "angular2-qrcode";

import { EqualValidator } from "../providers/equal-validator";
import { Elastic } from "../providers/elastic";

import { TabsPage } from "../pages/tabs/tabs";
import { LoginPage } from "../pages/login/login";
import { MySchedulePage } from "../pages/my-schedule/my-schedule";
import { MeetingDetailsPage } from "../pages/meeting-details/meeting-details";
import { MenuPage } from "../pages/menu/menu";
import { ScanAttendancePage } from "../pages/scan-attendance/scan-attendance";
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
import { ChatDetailsPage } from "../pages/chat-details/chat-details";
import { FindUserPage } from "../pages/find-user/find-user";
import { AdminArrangeMeetingPage } from "../pages/admin-arrange-meeting/admin-arrange-meeting";
import { AnnouncementPage } from "../pages/announcement/announcement";
import { AnnouncementDetailsPage } from "../pages/announcement-details/announcement-details";
import { FloorPlanPage } from "../pages/floor-plan/floor-plan";
import { MeetingFilterPipe } from "../providers/meeting-filter-pipe";

// export function provideStorage() {
//   return new Storage(['sqlite', 'websql', 'indexeddb'], { name: '__mydb' })
// }

export const firebaseConfig = {
  apiKey: "AIzaSyDtpFL8f_LKioxgdim8n3GCqNX_ZG6bqqk",
  authDomain: "ipi-chat.firebaseapp.com",
  databaseURL: "https://ipi-chat.firebaseio.com",
  storageBucket: "ipi-chat.appspot.com",
  messagingSenderId: "938935194124"
};

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
    ChatDetailsPage,
    FindUserPage,
    AdminArrangeMeetingPage,
    AnnouncementPage,
    AnnouncementDetailsPage,
    FloorPlanPage,
    MeetingFilterPipe
  ],
  imports: [
    IonicModule.forRoot(MyApp), Ionic2RatingModule,
    MomentModule, ProviderModule.forRoot(), QRCodeModule,
    AngularFireModule.initializeApp(firebaseConfig)
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
    ChatDetailsPage,
    FindUserPage,
    AdminArrangeMeetingPage,
    AnnouncementPage,
    AnnouncementDetailsPage,
    FloorPlanPage
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    //{ provide: Storage, useFactory: provideStorage }
  ]
})
export class AppModule { }
