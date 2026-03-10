import { Component, inject, OnInit } from '@angular/core';
import { ApplicationInfoComponent } from '../application-info/application-info.component';
import { AppplicationPaymentMethodComponent } from '../appplication-payment-method/appplication-payment-method.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApplicationService } from '../application.service';
import {ApplicationStateService} from '../application-state.service';
import {ApplicationKeysComponent} from '../application-keys/application-keys.component';
import { ApplicationSecretComponent } from '../application-secrets/application-secrets.component';
import { ApplicationKeysPercentComponent } from '../application-keys/application-keys-percent/application-keys-percent.component';
import { ApplicationSettlementComponent } from '../application-settlement/application-settlement.component';
import { ApplicationWebhookComponent } from '../application-webhook/application-webhook.component';
@Component({
  selector: 'app-application-gemeral',
  imports: [
    CommonModule,
    ApplicationInfoComponent,
    AppplicationPaymentMethodComponent,
    AppplicationPaymentMethodComponent,
    ApplicationKeysComponent,
    ApplicationSecretComponent,
    ApplicationKeysPercentComponent,
    ApplicationWebhookComponent,
    ApplicationSettlementComponent,
    RouterModule
  ],
  templateUrl: './application-gemeral.component.html',
  styleUrl: './application-gemeral.component.scss',
})
export class ApplicationGemeralComponent implements OnInit{
  private state = inject(ApplicationStateService)
  applicationId:any;

  constructor(
    private route:ActivatedRoute, 
    private applicaionService:ApplicationService) {
    
  }

  ngOnInit(): void {
  //   console.log(this.route.snapshot.paramMap.get('p1'))
  //   this.applicationId = this.route.snapshot.paramMap.get('p1');
  //   console.log(this.applicationId)
  //   this.state.setApplicationId(this.applicationId)
  }
  
}
