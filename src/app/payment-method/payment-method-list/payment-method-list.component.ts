import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { PaymentMethodService } from '../payment-method.service';
import { Observable } from 'rxjs';
import { ConfigForm, Method } from '../method.model';
import { PaymentMethodConfigComponent } from '../payment-method-config/payment-method-config.component';
import { Router, RouterModule } from '@angular/router';
import {getPaymentMethodLogo} from './../../utility/utility'
import { HttpClient } from '@angular/common/http';
import { StoreConfigService } from '../store-config.service';

@Component({
  selector: 'app-payment-method-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './payment-method-list.component.html',
  styleUrl: './payment-method-list.component.scss',
})
export class PaymentMethodListComponent implements OnInit{
  pmService = inject(PaymentMethodService);

  constructor(private router:Router,
    private store: StoreConfigService,private http:HttpClient){}

  // list:Method[] = []; 
  list:ConfigForm[] = []; 

  ngOnInit(): void {
    this.pmService.getFormConfig().subscribe({
        next: res => {
          this.list = res;
          this.store.providers = res; // 👈 setter global
        },
        error: err => console.error('ERREUR JSON', err)
      });
  }

  getLogoUrl(name:string) {
    return getPaymentMethodLogo(name);
  }

  gotoConfig(id:string) {
    // const path = this.pathOf(name);
    if (id) {
    
       const route = `/methods/${id}/configuration`;
      // const route = `/methods/${id}/config-list`;

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
