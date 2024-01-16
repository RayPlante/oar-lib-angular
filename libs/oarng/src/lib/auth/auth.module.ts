import { ModuleWithProviders, NgModule, APP_INITIALIZER }     from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { AuthenticationService, OARAuthenticationService, MockAuthenticationService } from './auth.service';
import { ConfigModule, ConfigurationService } from '../config/config.module';
import { Credentials } from './auth';

export function createAuthenticationService(httpcli: HttpClient, cfgSvc: ConfigurationService,
                                            creds: Credentials|null = null)
{
    if (creds == null)
        return new OARAuthenticationService(httpcli, cfgSvc);
    return new MockAuthenticationService(creds)
}

/**
 * a module providing components used to build a wizard interface.
 */
@NgModule({
    imports: [
        CommonModule, ConfigModule
    ],
    declarations: [
    ],
    providers: [
        { provide: AuthenticationService, useClass: OARAuthenticationService }
    ],
    exports: [
    ]
})
export class AuthModule {
    /**
     * provide a singleton AuthenticationService that can accept static mock credentials
     */
    public static withCredentials(creds: Credentials|null = null): ModuleWithProviders<AuthModule> {
        return {
            ngModule: AuthModule,
            providers: [
                { provide: AuthenticationService, useFactory: createAuthenticationService,
                  deps: [ HttpClient, ConfigurationService, creds ] },
            ]
        };
    }
}

export { AuthenticationService, OARAuthenticationService, Credentials }
