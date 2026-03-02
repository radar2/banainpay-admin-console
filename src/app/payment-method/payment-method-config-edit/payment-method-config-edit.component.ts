import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PaymentMethodService } from '../payment-method.service';
import { StoreConfigService } from '../store-config.service';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-payment-method-config-edit',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NzTableModule],
  templateUrl: './payment-method-config-edit.component.html',
  styleUrl: './payment-method-config-edit.component.scss',
})
export class PaymentMethodConfigEditComponent {

  constructor(private route:ActivatedRoute,private router:Router,
     private paymentMethodService:PaymentMethodService,private store: StoreConfigService) {}
     
  @Output() saveSuccess = new EventEmitter<void>();
  @Output() resetSuccess = new EventEmitter<void>();

  fb = inject(NonNullableFormBuilder);
  p1:any;
  detail:any;
    configStruct: any = {
    configProperties: []
  };
  configDetail!:FormGroup ;

  ngOnInit(): void {
    this.p1 = this.route.snapshot.paramMap.get('p1');
    this.configDetail= this.fb.group({
        id: ['', [Validators.required]],
        countryCode: ['', [Validators.required]],
        providerId: ['', [Validators.required]],
        name: ['', [Validators.required]],
        providerType: ['', [Validators.required]],
        configs: this.fb.group({})
      });
    if (this.p1) {      
      this.loadConfigList();
      this.loadConfigurations();
    }
  }

  resetForm() {
      this.configDetail.reset();
  }

  loadConfigList() {
    this.paymentMethodService.getPaymentProviderConfig(this.p1).subscribe({
      next: (res: any) => {
        // 👉 si l'API retourne déjà les données
        // this.detail = res;

        // 👉 données mock (temporaire)
        this.detail = {
            id: '84c12f12-1bc7-4cdd-a863-9a8e34559290',
            name: 'Wave CI 1',
            providerId: 'wave-ci 1',
            providerType: 'payment-provider 1',
            countryCode: 'CI',
            Optionavecselect: 'Option 11',
            configs: {
              apiKey: 'feifuegrfye 1',
              apiUrl :"https://api.wave.com/v1/checkout/sessions1",
              callbackUrl : "https://api.wave.com/v1/checkout/sessions1",
              currency: 'XOF'
            },
            supportedCountriesAsList: ['CI', 'SN']
          };

        //   console.log(this.detail);

        // this.tryLoadConfigDetail();

      },
      error: err => {
        console.error('ERREUR JSON', err);
      }
    });
  }


  
  loadConfigurations() {

    const data = this.store.getByProviderId(this.p1);
    this.configStruct = data;

    const configsGroup = this.configDetail.get('configs') as FormGroup;
  
    Object.keys(configsGroup.controls).forEach(key =>
      configsGroup.removeControl(key)
    );
  
    data.configProperties.forEach((conf: any) => {

      const validators = conf.required ? [Validators.required, Validators.minLength(1)] : [];

      configsGroup.addControl(
        conf.name,
        new FormControl(
          { value: '', disabled: conf.readOnly },
          validators
        )
      );
    });
  
    this.configDetail.patchValue({
      // countryCode: data.countryCode,
      providerId: data.providerId,
      name: data.name,
      providerType: data.providerType
    });
  
    const configsValues: any = {};
    data.configProperties.forEach((conf: any) => {
      configsValues[conf.name] = conf.defaultValue ?? '';
      // configsValues[conf.name] = conf.defaultValue ?? '';
    });

    configsGroup.patchValue(configsValues);
  }

  isChecked(name: string, value: string): boolean {
    const control = this.configDetail.get('configs.' + name);
    if (!control?.value) return false;

    return control.value.split(';').includes(value);
  }

  onCheckboxChange(event: Event, name: string, value: string) {

    const control = this.configDetail.get('configs.' + name);
    if (!control) return;

    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;

    // Convertir "a;b;c" → ["a","b","c"]
    let current: string[] = control.value
      ? control.value.split(';').filter(Boolean)
      : [];

    if (target.checked) {
      if (!current.includes(value)) {
        current.push(value);
      }
    } else {
      current = current.filter(v => v !== value);
    }

    // Convertir ["a","b","c"] → "a;b;c"
    const newValue = current.join(';');

    // 🔥 mise à jour Angular
    control.setValue(newValue);
    control.markAsDirty();
    control.markAsTouched();
    control.updateValueAndValidity();

  }





  
  // loadConfigurations() {

  //   const data = this.store.getByProviderId(id);
  //   this.configStruct = data;

  //   const configsGroup = this.configDetail.get('configs') as FormGroup;
  
  //   Object.keys(configsGroup.controls).forEach(key =>
  //     configsGroup.removeControl(key)
  //   );
  
  //   data.configProperties.forEach((conf: any) => {

  //     const validators = conf.required ? [Validators.required, Validators.minLength(1)] : [];

  //     configsGroup.addControl(
  //       conf.name,
  //       new FormControl(
  //         { value: '', disabled: conf.readOnly },
  //         validators
  //       )
  //     );
  //   });
  
  //   this.configDetail.patchValue({
  //     // countryCode: data.countryCode,
  //     providerId: data.providerId,
  //     name: data.name,
  //     providerType: data.providerType
  //   });
  
  //   const configsValues: any = {};
  //   data.configProperties.forEach((conf: any) => {
  //     configsValues[conf.name] = conf.defaultValue ?? '';
  //   });

  //   configsGroup.patchValue(configsValues);
  // }

  // isChecked(name: string, value: string): boolean {
  //   const control = this.configDetail.get('configs.' + name);
  //   if (!control?.value) return false;

  //   return control.value.split(';').includes(value);
  // }

  // onCheckboxChange(event: Event, name: string, value: string) {

  //   const control = this.configDetail.get('configs.' + name);
  //   if (!control) return;

  //   const target = event.target;
  //   if (!(target instanceof HTMLInputElement)) return;

  //   // Convertir "a;b;c" → ["a","b","c"]
  //   let current: string[] = control.value
  //     ? control.value.split(';').filter(Boolean)
  //     : [];

  //   if (target.checked) {
  //     if (!current.includes(value)) {
  //       current.push(value);
  //     }
  //   } else {
  //     current = current.filter(v => v !== value);
  //   }

  //   // Convertir ["a","b","c"] → "a;b;c"
  //   const newValue = current.join(';');

  //   // 🔥 mise à jour Angular
  //   control.setValue(newValue);
  //   control.markAsDirty();
  //   control.markAsTouched();
  //   control.updateValueAndValidity();

  // }

}
