import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NzTableModule } from 'ng-zorro-antd/table';
import { Observable, switchMap } from 'rxjs';
import { PaymentDetailsComponent } from '../../payments/payment-details/payment-details.component';
import { Payment } from '../../payments/payment.model';
import { PaymentService } from '../../payments/payment.service';
import { Wallet } from '../../payments/wallet.model';
import { Utility } from '../../utility/utility';
import { ApplicationStateService } from '../application-state.service';
import { Application } from '../application.model';

@Component({
  selector: 'appplication-analistics',
   imports: [CommonModule, RouterModule, PaymentDetailsComponent, NzTableModule],
  templateUrl: './appplication-analistics.component.html',
  styleUrl: './appplication-analistics.component.scss',
})
export class AppplicationAnalisticsComponent {
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

    this.balance$ = this.state.getApplicationId().pipe(
       switchMap(id => this.paymentServcice.getBalanceOfApplication(id!)));
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
