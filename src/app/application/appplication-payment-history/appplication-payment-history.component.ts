import { Component, inject, OnInit } from '@angular/core';
import { ApplicationStateService } from '../application-state.service';
import { CommonModule } from '@angular/common';
import {PaymentDetailsComponent} from '../../payments/payment-details/payment-details.component'
import { NzTableModule } from 'ng-zorro-antd/table';
import {PaymentService} from './../../payments/payment.service';
import { Observable, switchMap } from 'rxjs';
import { Payment } from './../../payments/payment.model';
import { Wallet } from '../../payments/wallet.model';
import { RouterModule } from '@angular/router';
import { Application } from '../application.model';
import { Utility } from '../../utility/utility';

@Component({
  selector: 'app-appplication-payment-history',
  imports: [CommonModule, RouterModule, PaymentDetailsComponent, NzTableModule],
  templateUrl: './appplication-payment-history.component.html',
  styleUrl: './appplication-payment-history.component.scss',
})
export class AppplicationPaymentHistoryComponent implements OnInit{

  private state = inject(ApplicationStateService);
  private paymentServcice = inject(PaymentService);
  paymentsList:Payment[]= [];
  balance$:Observable<Wallet> = new Observable();
  application:Application | null = null;
  paymentId!:string;
  ngOnInit(): void {
    this.state.get().subscribe((data) => this.application = data);

    this.state.getApplicationId().pipe(
      switchMap(id => this.paymentServcice.getPaymentsOfApplication(id!))
    ).subscribe(
      data => {
        this.paymentsList = data
      }
    )

    this.balance$ = this.state.get().pipe(
       switchMap(app => this.paymentServcice.getBalanceOfApplication(app?.id!)));
  }


  loadBalance(applicationId:string) {
     this.paymentServcice.getBalanceOfApplication(applicationId);
  }

  convertMoney(amount:any) {
      return amount? Utility.convertMonney(amount, 'XOF'): Utility.convertMonney(0, 'XOF')
  }

   showDetails(paymentId:string) {
    if (paymentId) {
      this.paymentId = paymentId;
    }
  }
}
