import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule, FormControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PaymentMethodService } from '../payment-method.service';
import { NzTableModule } from 'ng-zorro-antd/table';
import { getPaymentMethodLogo } from '../../utility/utility';
import { ConfigForm } from '../method.model';
import { StoreConfigService } from '../store-config.service';
declare var bootstrap: any;

@Component({
  selector: 'app-payment-method-config',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NzTableModule],
  templateUrl: './payment-method-config.component.html',
  styleUrl: './payment-method-config.component.scss',
})
export class PaymentMethodConfigComponent {
  p1:any;
  p2:any;
  configurations: any = {
    configProperties: []
  };

  list:ConfigForm[] = [];

  fb = inject(NonNullableFormBuilder);

  constructor(private route:ActivatedRoute,private router:Router,
     private paymentMethodService:PaymentMethodService,private store: StoreConfigService) {}

     configForm!:FormGroup;

  ngAfterViewInit() {
    new bootstrap.Tooltip(document.body, {
      selector: '[data-bs-toggle="tooltip"]'
    });
  }

  ngOnInit(): void {
    this.p1 = this.route.snapshot.paramMap.get('p1');
    this.configForm = this.fb.group({
      countryCode: ['', [Validators.required]],
      providerId: ['', [Validators.required]],
      name: ['', [Validators.required]],
      providerType: ['', [Validators.required]],
    });
    if (this.p1) {      
      this.loadConfigList(this.p1);
      this.loadConfigurations(this.p1);
    }
  }

  loadConfigList(id:any) {
    // this.paymentMethodService.getConfigurations(id).subscribe(
    //     (data:any) => this.configurations = data
    //   )

      this.paymentMethodService.getFormConfig().subscribe({
        next: res => {
          this.list = res;
        },
        error: err => console.error('ERREUR JSON', err)
      });
  }

  loadConfigurations(id:any) {
    let data1 = this.store.getByProviderId(this.p1);
    let data = data1['configProperties'];
    // this.configurations = this.store.getByProviderId(this.p1)['configProperties'];
    this.configurations = data1;
    
    this.configForm.patchValue({
      providerId: data1.providerId,
      name: data1.name,
      providerType: data1.providerType,
    });

    data.forEach((conf:any) => {

        let value: any = '';

        // valeur par défaut
        if (conf.defaultValue) {

          if (conf.type === 'MultivaluedList') {
            value = conf.defaultValue.split(';');
          } else {
            value = conf.defaultValue;
          }
        }

        const validators = [];
        if (conf.required) {
          validators.push(Validators.required);
        }

        this.configForm.addControl(
          conf.name,
          new FormControl({ value, disabled: conf.readOnly }, validators)
        );
      });

  }

  onCheckboxChange(event: any, name: string, value: string) {
    const control = this.configForm.get(name);
    let values = control?.value || [];

    if (event.target.checked) {
      values.push(value);
    } else {
      values = values.filter((v: string) => v !== value);
    }

    control?.setValue(values);
    control?.markAsTouched();
  }

  getConfig(id:string) {
    // const path = this.pathOf(name);
    if (id) {
    
       const route = `/methods/${id}/config-list`;
      this.router.navigateByUrl(route)
    }
   
  }

  getLogoUrl(name:string) {
    return getPaymentMethodLogo(name);
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

  buildPayload() {
    const formValue = this.configForm.getRawValue();

    const configs: any = {};
    this.configurations.configProperties.forEach((conf: any) => {
      configs[conf.name] = formValue[conf.name];
    });

    return {
      id: this.configurations?.id ?? null,
      name: formValue.name,
      providerId: formValue.providerId,
      providerType: formValue.providerType,
      configs
    };
  }


  save() {

    if (this.configForm.invalid) return;
    const payload = this.buildPayload();

    console.log(payload);
    // console.log(this.configForm.value);
    return;

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

