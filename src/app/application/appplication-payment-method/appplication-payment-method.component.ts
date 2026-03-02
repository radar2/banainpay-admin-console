import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApplicationService } from '../application.service';
import { Observable, switchMap } from 'rxjs';
import { PaymentProvider } from './../../payment-method/method.model';
import { ApplicationStateService } from '../application-state.service';
import {getPaymentMethodLogo} from './../../utility/utility';
import { NzTableModule } from 'ng-zorro-antd/table';
@Component({
  selector: 'appplication-payment-method',
  imports: [CommonModule, RouterModule, NzTableModule],
  templateUrl: './appplication-payment-method.component.html',
  styleUrl: './appplication-payment-method.component.scss',
})
export class AppplicationPaymentMethodComponent implements OnInit{
  lists:PaymentProvider[] = [];
  private applicationId:any;

  constructor(
    private state:ApplicationStateService,
    private applicationService:ApplicationService) {
      
  }

  ngOnInit(): void {
    this.state.getApplicationId().pipe(
      switchMap(id => {
        this.applicationId = id!;
        return this.applicationService.getPaymentMethods(this.applicationId)
      })
    ).subscribe(
      (data) => this.lists = data
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
