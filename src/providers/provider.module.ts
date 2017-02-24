import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MeetingService } from "./meeting-service";
import { GlobalVarsService } from "./global-vars-service";
import { AuthService } from "./auth-service";
import { CryptoService } from "./crypto-service";
import { FirebaseChatService } from "./firebase-chat-service";

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
    imports: [CommonModule],
    declarations: [],
    exports: [CommonModule]
})
export class ProviderModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: ProviderModule,
            providers: [
                MeetingService,
                GlobalVarsService,
                CryptoService,
                AuthService,
                FirebaseChatService
            ]
        };
    }
}
