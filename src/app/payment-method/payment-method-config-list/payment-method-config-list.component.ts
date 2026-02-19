import { Component } from '@angular/core';
import { PaymentMethodService } from '../payment-method.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { getPaymentMethodLogo } from '../../utility/utility';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-method-config-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './payment-method-config-list.component.html',
  styleUrl: './payment-method-config-list.component.scss',
})
export class PaymentMethodConfigListComponent {
  
  constructor(private route:ActivatedRoute,private router:Router,private http:HttpClient,
     private paymentMethodService:PaymentMethodService) {}

  p1:any;
  p2:any;
  configurations:any[] = [];

  
  ngOnInit(): void {
    this.p1 = this.route.snapshot.paramMap.get('p1');
    if (this.p1) {
      
      this.loadConfigurations(this.p1);
    }
  }

  loadConfigurations(id:any) {
    // this.paymentMethodService.getConfigurations(id).subscribe(
    //     (data:any) => this.configurations = data
    //   )

      this.paymentMethodService.getFormConfig().subscribe({
        next: res => {
          this.configurations = res;
        },
        error: err => console.error('ERREUR JSON', err)
      });
  }

    getLogoUrl(name:string) {
      return getPaymentMethodLogo(name);
    }

    getConfig(id:string) {
    // const path = this.pathOf(name);
    if (id) {
    
       const route = `/methods/${id}/config-list`;
      this.router.navigateByUrl(route)
    }
   
  }

}
