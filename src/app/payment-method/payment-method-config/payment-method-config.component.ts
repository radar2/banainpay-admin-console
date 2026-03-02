import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { NonNullableFormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule, FormControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PaymentMethodService } from '../payment-method.service';
import { NzTableModule } from 'ng-zorro-antd/table';
import { getPaymentMethodLogo } from '../../utility/utility';
import { ConfigForm } from '../method.model';
import { StoreConfigService } from '../store-config.service';
import { PaymentMethodConfigEditComponent } from '../payment-method-config-edit/payment-method-config-edit.component';
declare var bootstrap: any;

@Component({
  selector: 'app-payment-method-config',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NzTableModule,PaymentMethodConfigEditComponent],
  templateUrl: './payment-method-config.component.html',
  styleUrl: './payment-method-config.component.scss',
})
export class PaymentMethodConfigComponent {
  p1:any;
  p2:any;
  configurations: any = {
    configProperties: []
  };

  configForm!:FormGroup;
  list:ConfigForm[] = [];

  // detail!:any;
  // configDetail!:FormGroup;

  fb = inject(NonNullableFormBuilder);

  constructor(private route:ActivatedRoute,private router:Router,
     private paymentMethodService:PaymentMethodService,private store: StoreConfigService) {}

       //echange avec le composant enfant
  @ViewChild('editChild') editChild!: PaymentMethodConfigEditComponent;

  resetChildForm() {
    const modalElement = document.getElementById('editModal');
      if (modalElement) {
        new bootstrap.Modal(modalElement).show();
      }
    // this.editChild.resetForm(); // Appelle la méthode dans le composant enfant
    setTimeout(() => {
      this.editChild?.resetForm();
    });
  }


  onEdit() {
    // console.log('Parent notifié : utilisateur ajouté');    
    // this.toastService.closeOffcanvas('offcanvasExample');
    // this.loader();
    
    const modalElement = document.getElementById('editModal');
      if (modalElement) {
        new bootstrap.Modal(modalElement).hide();
      }
  }

  onReset(){
    
    const modalElement = document.getElementById('editModal');
      if (modalElement) {
        new bootstrap.Modal(modalElement).hide();
      }
    //this.PaymentMethodConfigEditComponent.resetForm(); // Appelle la méthode dans le composant enfant
  }









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
      configs: this.fb.group({})
    });


    if (this.p1) {      
      this.loadConfigList(this.p1);
      this.loadConfigurations(this.p1);
    }
  }

  loadConfigList(id:any) {
      this.paymentMethodService.getProviderComponents().subscribe({
        next: res => {
          this.list = res;
        },
        error: err => console.error('ERREUR JSON', err)
      });
  }
  
  loadConfigurations(id: any) {

    const data = this.store.getByProviderId(id);
    this.configurations = data;

    const configsGroup = this.configForm.get('configs') as FormGroup;
  
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
  
    this.configForm.patchValue({
      // countryCode: data.countryCode,
      providerId: data.providerId,
      name: data.name,
      providerType: data.providerType
    });
  
    const configsValues: any = {};
    data.configProperties.forEach((conf: any) => {
      configsValues[conf.name] = conf.defaultValue ?? '';
    });

    configsGroup.patchValue(configsValues);
  }

  isChecked(name: string, value: string): boolean {
    const control = this.configForm.get('configs.' + name);
    if (!control?.value) return false;

    return control.value.split(';').includes(value);
  }

  onCheckboxChange(event: Event, name: string, value: string) {

    const control = this.configForm.get('configs.' + name);
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

  getConfig(id:string) {
    // const path = this.pathOf(name);
    if (id) {
    
       const route = `/methods/${id}/config-list`;
      this.router.navigateByUrl(route)
    }
   
  }

//   openEditModal(item: any) {
//     this.paymentMethodService.getProviderComponentsDetail(item).subscribe({
//       next: (res: any) => {
//         // 👉 si l'API retourne déjà les données
//         // this.detail = res;

//         // 👉 données mock (temporaire)
//         this.detail = {
//             id: '84c12f12-1bc7-4cdd-a863-9a8e34559290',
//             name: 'Wave CI 1',
//             providerId: 'wave-ci 1',
//             providerType: 'payment-provider 1',
//             countryCode: 'CI',
//             Optionavecselect: 'Option 11',
//             configs: {
//               apiKey: 'feifuegrfye 1',
//               apiUrl :"https://api.wave.com/v1/checkout/sessions1",
//               callbackUrl : "https://api.wave.com/v1/checkout/sessions1",
//               currency: 'XOF'
//             },
//             supportedCountriesAsList: ['CI', 'SN']
//           };

//           console.log(this.detail);

//         this.tryLoadConfigDetail();

//       },
//       error: err => {
//         console.error('ERREUR JSON', err);
//       }
//     });

//     // this.loadConfigDetail();

//   }

//   tryLoadConfigDetail(): void {
//     if (
//       this.detail &&
//       this.configurations?.configProperties?.length
//     ) {
//       this.loadConfigDetail();


//     }
//   }

//   loadConfigDetail(): void {
//     if (
//       !this.detail ||
//       !this.configurations ||
//       !this.configurations.configProperties ||
//       this.configurations.configProperties.length === 0
//     ) {
//       return;
//     }

//     const data = this.detail;
//     const configProperties = this.configurations.configProperties;
//     // this.configurations = data;

//     const configsGroup = this.configDetail.get('configs') as FormGroup;
  
//     Object.keys(configsGroup.controls).forEach(key =>
//       configsGroup.removeControl(key)
//     );
  
//     configProperties.forEach((conf: any) => {

//       //const validators = conf.required ? [Validators.required, Validators.minLength(1)] : [];

//       configsGroup.addControl(
//         conf.name,
//          this.fb.control(
//           '', 
//           conf.required ? Validators.required : null
//         )
//       );
//     });

//     this.configDetail.patchValue({
//       id: data.id,
//       countryCode: data.countryCode,
//       providerId: data.providerId,
//       name: data.name,
//       providerType: data.providerType,
//       configs: data.configs
//     });

  
//     // const configsValues: any = {};
//     // this.configurations.configProperties.forEach((conf: any) => {
//     //   // configsValues[conf.name] = conf.defaultValue ?? '';
      
//     //   // configsGroup.patchValue(configsValues);
//     //   // this.configDetail.patchValue({
//     //   //   [conf.name] : data.configs?.[conf.name] ?? ''
//     //   // });
//     //   configsValues[conf.name] = data.configs?.[conf.name] ?? '';
//     // });
      
//     // this.configDetail.patchValue({
//     //   countryCode: data.countryCode,
//     //   providerId: data.providerId,
//     //   name: data.name,
//     //   providerType: data.providerType
//     // });

//     // configsGroup.patchValue(configsValues);


//   console.log(this.configDetail);

//   //   let data = this.detail;
//   //   let configDetail = this.configDetail.get('configs') as FormGroup;
    

//   //   // reset
//   //   Object.keys(configDetail.controls).forEach(key =>
//   //     configDetail.removeControl(key)
//   //   );

//   //   // création dynamique des champs
//   //   this.configurations.configProperties.forEach((conf: any) => {
//   //     configDetail.addControl(
//   //       conf.name,
//   //       new FormControl(
//   //         { value: '', disabled: conf.readOnly },
//   //         conf.required ? [Validators.required] : []
//   //       )
//   //     );
//   //   });

//   //   // patch principal
//   //   this.configDetail.patchValue({
//   //     id: data.id,
//   //     countryCode: data.countryCode,
//   //     providerId: data.providerId,
//   //     name: data.name,
//   //     providerType: data.providerType
//   //   });

//   //   // patch configs
//   //   const configsValues: any = {};
//   //   this.configurations.configProperties.forEach((conf: any) => {
//   //     console.log(conf.name);
//   //     console.log(data.configs?.[conf.name]);
//   //     configsValues[conf.name] = data.configs?.[conf.name] ?? '';
//   //     console.log(configsValues);
//   //   });

//   // configDetail.patchValue(configsValues);

//   // ouverture modal
//   const modalElement = document.getElementById('editModal');
//   if (modalElement) {
//     new bootstrap.Modal(modalElement).show();
//   }
// }

//   loadConfigDetail(): void {

//     console.log('DETAIL', this.detail);
//     console.log('CONFIGURATIONS', this.configurations);
//     console.log('PROPERTIES', this.configurations?.configProperties);

//   const data = this.detail;
//   const config = this.configurations;

//   if (!data || !config) return;

//   const configDetail = this.configDetail.get('configs') as FormGroup;

//   // 🔁 reset dynamique
//   Object.keys(configDetail.controls).forEach(key =>
//     configDetail.removeControl(key)
//   );

//   // ➕ création des champs dynamiques
//   config.configProperties.forEach((conf: any) => {
//     const validators = conf.required ? [Validators.required] : [];

//     configDetail.addControl(
//       conf.name,
//       new FormControl(
//         { value: '', disabled: conf.readOnly },
//         validators
//       )
//     );
//   });

//   // 🧩 patch des champs simples
//   this.configDetail.patchValue({
//     id: data.id,
//     countryCode: data.countryCode,
//     providerId: data.providerId,
//     name: data.name,
//     providerType: data.providerType
//   });

//   // 🧩 patch configs
//   const configsValues: any = {};
//   config.configProperties.forEach((conf: any) => {
//     configsValues[conf.name] = data.configs?.[conf.name] ?? '';
//   });

//   configDetail.patchValue(configsValues);

//   // 🪟 ouverture du modal
//   const modalElement = document.getElementById('editModal');
//   if (modalElement) {
//     new bootstrap.Modal(modalElement).show();
//   }
// }

  // loadConfigDetail() {

  //   let data = this.detail;
  //   let config = this.configurations; 

  //   const configDetail = this.configDetail.get('configs') as FormGroup;
  
  //   Object.keys(configDetail.controls).forEach(key =>
  //     configDetail.removeControl(key)
  //   );
  
  //   config.configProperties.forEach((conf: any) => {

  //     const validators = conf.required ? [Validators.required, Validators.minLength(1)] : [];

  //     configDetail.addControl(
  //       conf.name,
  //       new FormControl(
  //         { value: '', disabled: conf.readOnly },
  //         validators
  //       )
  //     );
  //   });
  
  //   this.configDetail.patchValue({
  //     id: data.id,
  //     countryCode: data.countryCode,
  //     providerId: data.providerId,
  //     name: data.name,
  //     providerType: data.providerType
  //   });
  
  //   const configsValues: any = {};
  //   // data.configs.forEach((conf: any) => {
  //   //   configsValues[conf.name] = conf.defaultValue ?? '';
  //   // });


  //   config.configProperties.forEach((conf: any) => {
  //     configsValues[conf.name] = data.configs[conf.name] ?? '';
  //   });

  //   configDetail.patchValue(configsValues);
    
  //   // ✅ ouvrir le modal APRÈS chargement des données
  //   const modalElement = document.getElementById('editModal');
  //   if (modalElement) {
  //     const modal = new bootstrap.Modal(modalElement);
  //     modal.show();
  //   }
  // }

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
    formValue['id']=this.configurations?.id ?? null;

    return formValue;
  }

  save() {

    if (this.configForm.invalid) return;
    const payload = this.buildPayload();

    console.log(payload);
    // console.log(this.configForm.value);
    return;
    if (this.p1) {
      this.paymentMethodService.saveConfiguration(payload).subscribe(
          (success) => {
              this.configForm.reset();
              // this.loadConfigurations(this.p1);
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

