import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { PaymentService } from '../payment.service';
import { Payment } from '../payment.model';
import { getPaymentMethodLogo } from '../../utility/utility';
import {MoneyUtility} from './../../utility/money.utility';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzStepsModule } from 'ng-zorro-antd/steps';

@Component({
  selector: 'payment-details',
  imports: [CommonModule, NzDividerModule, NzStepsModule],
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.scss'],
})
export class PaymentDetailsComponent  implements OnInit, OnChanges{
  paymentService = inject(PaymentService);

  @Input() paymentId!:string ; 
  payment!:Payment;
  events:any[] = []
  

  ngOnInit(): void {
    // this.paymentService.getPaymentDetails()
  }

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['paymentId']
    if (changes && change.currentValue &&  change.currentValue != change.previousValue) {
        this.loadPaymentDetails(change.currentValue)
    }
  }

  loadPaymentDetails(paymentId:string) {
    this.paymentService.getPaymentDetails(paymentId).subscribe(
      (data) =>{
        this.payment = data 
        this.events = data.events
      }
    )
  }

  getLogoUrl(name:string) {
    return getPaymentMethodLogo(name)
  }

  convertMoney(amount:any) {
    return amount?  MoneyUtility.format(amount, 'XOF'): MoneyUtility.format(0, 'XOF');
  }

  formatDate(date:string) {
    
    if (date) {
      // return new Date(date).toDateString();
      return new Intl.DateTimeFormat('fr-FR', {
      'dateStyle':'full',
      'timeStyle': 'medium'
      
      }).format(new  Date(date))
    }

    return '';
  }


}





