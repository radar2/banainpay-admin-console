import { Component, OnInit } from '@angular/core';
import { ApplicationStateService } from '../application-state.service';
import { map, Observable, of, switchMap } from 'rxjs';
import { Transaction } from '../../payments/payment.model';
import { PaymentService } from '../../payments/payment.service';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { filter } from 'lodash-es';
import { Application } from '../application.model';
import { Utility } from '../../utility/utility';

@Component({
  selector: 'app-appplication-wallet',
  imports: [CommonModule, NzTableModule],
  templateUrl: './appplication-wallet.component.html',
  styleUrl: './appplication-wallet.component.scss',
})
export class AppplicationWalletComponent implements OnInit{

  transactions: Transaction[] = [];

  constructor(
    private state:ApplicationStateService, 
    private paymentService: PaymentService) {}

  ngOnInit(): void {
    
    this.state.get().pipe(
    switchMap(app => {
      console.log(app);
      return this.paymentService.getTransactionHistory(app?.id!)
    })
      
    ).subscribe(
      (data) => this.transactions = data
    )
  }

  goToPaymentHistory() {
    history.back();
  }

  convertMoney(amount:number) {
      return amount? Utility.convertMonney(amount, 'XOF'): Utility.convertMonney(0, 'XOF')
    }

}
