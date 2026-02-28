import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { PaymentMethodService } from '../payment-method.service';
import { Observable } from 'rxjs';
import { Method } from '../method.model';
import { PaymentMethodConfigComponent } from '../payment-method-config/payment-method-config.component';
import { Router, RouterModule } from '@angular/router';
import {getPaymentMethodLogo} from './../../utility/utility'

@Component({
  selector: 'app-payment-method-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './payment-method-list.component.html',
  styleUrl: './payment-method-list.component.scss',
})
export class PaymentMethodListComponent implements OnInit{
  pmService = inject(PaymentMethodService);

  constructor(private router:Router){}

  list:Method[] = []; 

  ngOnInit(): void {
    // this.pmService.getList().subscribe(
    //   (data) => this.list = data
    // )

    this,this.pmService.getPaymentProviders().subscribe(
      (data) => {this.list = data; console.log(data)}
    )
  }

  getLogoUrl(name:string) {
    return getPaymentMethodLogo(name);
  }

  gotoConfig(id:string) {
    if (id) {
    
       const route = `/methods/${id}/configuration`;
      this.router.navigateByUrl(route)
    }
   
  }


  pathOf(name:string) {
    name = name.toLowerCase();
    if (name.includes("wave")) {
      return 'wave';
    } else if (name.includes("mtn")) {
      return 'momo';
    }else if (name.includes("orange")) {
      return 'orange';
    }else if (name.includes("moov")) {
      return 'moov';
    }

    return null;
  }
}
