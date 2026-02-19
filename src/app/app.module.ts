import {ApplicationConfig, NgModule, provideZoneChangeDetection} from '@angular/core'
import {AppComponent} from "./app.component";
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { provideRouter, Route, RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import {
  provideKeycloak,
  createInterceptorCondition,
  IncludeBearerTokenCondition,
  includeBearerTokenInterceptor,
  INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
  AutoRefreshTokenService,
  UserActivityService,
  withAutoRefreshToken
} from 'keycloak-angular';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppPaymentMethodConfigListComponent } from './payment-method/app-payment-method-config-list/app-payment-method-config-list.component';
import { PaymentMethodConfigListComponent } from './payment-method/payment-method-config-list/payment-method-config-list.component';




@NgModule({
    declarations:[
    AppPaymentMethodConfigListComponent,
    PaymentMethodConfigListComponent
  ],
    imports:[
        BrowserAnimationsModule,
        BrowserModule,
        CommonModule,
        // RouterModule.forRoot(routes)
    ],
    providers:[
     
    ],
    bootstrap:[]
})
export class AppModule {}