import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApplicationService } from '../application.service';
import { Observable, switchMap } from 'rxjs';
import { PaymentProvider } from './../../payment-method/method.model';
import { ApplicationStateService } from '../application-state.service';
import {getPaymentMethodLogo} from './../../utility/utility';
import { NzTableModule } from 'ng-zorro-antd/table';
import {NzMessageService} from 'ng-zorro-antd/message';

import { PaymentMethodService } from '../../payment-method/payment-method.service';
import { messages } from '../../messages';
@Component({
  selector: 'appplication-payment-method',
  imports: [CommonModule, RouterModule, NzTableModule, NgOptimizedImage],
  templateUrl: './appplication-payment-method.component.html',
  styleUrl: './appplication-payment-method.component.scss',
})
export class AppplicationPaymentMethodComponent implements OnInit{
  lists:PaymentProvider[] = [];
  allProviders:PaymentProvider[] = [];
  private applicationId:any;
  providerIdsSelected:any[] = [];

  constructor(
    private state:ApplicationStateService,
    private message:NzMessageService,
    private paymentMathodService:PaymentMethodService,
    private applicationService:ApplicationService) {
      
  }

  ngOnInit(): void {
    this.state.getApplicationId().pipe(
      switchMap(id => {
        this.applicationId = id!;
        return this.applicationService.getPaymentMethods(this.applicationId)
      })
    ).subscribe(
      (data) => {this.lists = data; this.ensureDisctincts()}
    )

    this.paymentMathodService.getPaymentProviders().subscribe(
      (data) => {
        this.allProviders = data;
        this.ensureDisctincts()
      }
    )
  }

  ensureDisctincts() {

    let listIds = this.lists.map(p => p.id);
    this.allProviders = this.allProviders.filter(p => !listIds.includes(p.id));
  }

  onClick(p:PaymentProvider) {
    let ids = this.providerIdsSelected;
    if (!ids.includes(p.id)) {
      ids.push(p.id);
    }else {
      ids = ids.filter(id => id == p.id);
    }
    
    this.providerIdsSelected = ids;

  }

  addProvider(provider:PaymentProvider) {
    this.applicationService.addPaymentProviderToApplication(this.applicationId, provider.id).subscribe(
      (data)=> {
        this.message.success(messages.operation.success)
         this.allProviders = this.allProviders.filter(p => p.id != provider.id);
         this.lists.push(provider)
      },
      (error) => this.message.error(messages.operation.error)
      
    )
  }

    removeProvider(provider:PaymentProvider) {
    this.applicationService.removePaymentProviderFromApplication(this.applicationId, provider.id).subscribe(
      (data)=> {
        this.message.success(messages.operation.success);
         this.lists = this.lists.filter(p => p.id == provider.id);
         this.allProviders.push(provider)
      },
      (error) => this.message.error(messages.operation.error)
      
    )
  }


  getLogo(name:string) {
      return getPaymentMethodLogo(name);
  }

  // acivateMethod(methodId:string){
    
  //   if (this.applicationId) {
  //     this.applicationService.activateMethod(this.applicationId, methodId).subscribe(
  //       (data) => {
  //         this.list$ = this.applicationService.getPaymentMethods(this.applicationId)
  //       }
  //     )
  //   }
  // }

}
