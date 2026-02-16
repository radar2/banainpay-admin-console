import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NzTableModule } from 'ng-zorro-antd/table';
import { Observable } from 'rxjs';
import { Payment } from '../payment.model';
import { PaymentService } from '../payment.service';
import { PaymentDetailsComponent } from '../payment-details/payment-details.component';
import {MoneyUtility} from '../../utility/money.utility';



@Component({
  selector: 'app-payment-list',
  standalone:true,
  imports: [CommonModule, RouterModule, NzTableModule, PaymentDetailsComponent],
  templateUrl: './payment-list.component.html',
  styleUrl: './payment-list.component.scss',
})

export class PaymentListComponent implements OnInit{

  paymentService = inject(PaymentService);

  constructor() {}

  paymentsList:Payment[] = [];

  paymentId!:string;

  ngOnInit(): void {
    this.paymentService.getPaymentsHistory().subscribe(
      (data) => this.paymentsList = data,
      (err) => console.error(err)
    )
  }

  formatAmount(amount:number) {
    return amount? MoneyUtility.formatToXOF(amount): MoneyUtility.formatToXOF(0)
  }

  showDetails(paymentId:string) {
    if (paymentId) {
      this.paymentId = paymentId;
    }
  }
}
