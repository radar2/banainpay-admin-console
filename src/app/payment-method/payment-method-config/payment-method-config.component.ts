import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PaymentMethodService } from '../payment-method.service';
import { NzTableModule } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-payment-method-config',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NzTableModule],
  templateUrl: './payment-method-config.component.html',
  styleUrl: './payment-method-config.component.scss',
})
export class PaymentMethodConfigComponent {
  p1:any;
  p2:any;
  configurations:any[] = [];

  fb = inject(NonNullableFormBuilder);

  constructor(private route:ActivatedRoute,
     private paymentMethodService:PaymentMethodService) {}

  configForm:FormGroup = this.fb.group(
    {
      countryCode: ['', [Validators.required]],
      key: ['', [Validators.required]],
      value: ['', [Validators.required]],
      encrypted: [false]
    }
  )



  ngOnInit(): void {
    this.p1 = this.route.snapshot.paramMap.get('p1');
    if (this.p1) {
      
      this.loadConfigurations(this.p1);
    }
  }

  loadConfigurations(id:any) {
    this.paymentMethodService.getConfigurations(id).subscribe(
        (data:any) => this.configurations = data
      )
  }

  get params(): FormArray {
    return <FormArray>  this.configForm.get('params');
  }

  createParam():FormGroup {
    return this.fb.group({
      name:[null, [Validators.required]],
      content:[null, [Validators.required]],
    })
  }

  addParam() {
      this.params.push(this.createParam());
  }


  save() {

    if (this.p1) {
      this.paymentMethodService.saveConfiguration(
        this.configForm.value, this.p1).subscribe(
          (success) => {
              this.configForm.reset();
              this.loadConfigurations(this.p1);
              this.closeModal();
          }
        )
    } 

    
  }

  private closeModal() {
    const closeBtn = document.querySelector(".btn-close") as HTMLButtonElement;
    if (closeBtn) {
      closeBtn.click()
    }
  }

  mapConfig(data:any[]) {
    let list = []
    for (let c of data) {
      for (let entry of c.entries) {
        list.push(
          {
            countryCode: c.countryCode,
            key: entry.key,
            value: entry.value,
            encrypted: entry.encrypted
          }
        )
      }
      
    }

    return list;
  }
}

