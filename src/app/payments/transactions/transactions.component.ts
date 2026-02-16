import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { PaymentService } from '../payment.service';
import { Observable } from 'rxjs';
import { Transaction } from '../payment.model';
import { NzTableModule } from 'ng-zorro-antd/table';
import { Utility } from '../../utility/utility';

@Component({
  selector: 'app-transactions',
  imports: [CommonModule, NzTableModule],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
})
export class TransactionsComponent implements OnInit{
  paymentService = inject(PaymentService);
  transactions:Transaction[] = [];

  ngOnInit(): void {
    this.paymentService.getAllTransactionsHistories().subscribe(
      (data)=> this.transactions = data
    )
  }


    convertMoney(amount:number) {
        return amount? Utility.convertMonney(amount, 'XOF'): Utility.convertMonney(0, 'XOF')
      }

}
