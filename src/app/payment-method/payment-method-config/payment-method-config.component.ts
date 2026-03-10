import { CommonModule } from '@angular/common';
import { Component, effect, inject, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { NonNullableFormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule, FormControl, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PaymentMethodService } from '../payment-method.service';
import { NzTableModule } from 'ng-zorro-antd/table';
import { getPaymentMethodLogo } from '../../utility/utility';
import { ConfigurationProperty, PaymentProvider, PaymentSpi } from '../method.model';
import { StoreConfigService } from '../store-config.service';
import { Observable, of } from 'rxjs';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import { messages } from '../../messages';
declare var bootstrap: any;

@Component({
  selector: 'app-payment-method-config',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NzTableModule],
  templateUrl: './payment-method-config.component.html',
  styleUrl: './payment-method-config.component.scss',
})

export class PaymentMethodConfigComponent implements OnInit, OnChanges{
  fb = inject(NonNullableFormBuilder);
  spiSelected:PaymentSpi | null = null;
  // p1 = 0;
  // providerId:any;
  paymentsSpiList$!:Observable<PaymentSpi[]>;
  configForm!:FormGroup

    @Input() p1 = 0
    @Input() providerId:any = null

  constructor(
    private route:ActivatedRoute,
    private router:Router,
    private paymentMethodService:PaymentMethodService,
    private store: StoreConfigService, 
    private message:NzMessageService,
    private notification:NzNotificationService
    ) {

     }


  ngAfterViewInit() {
    new bootstrap.Tooltip(document.body, {
      selector: '[data-bs-toggle="tooltip"]'
    });
  }

  ngOnInit(): void {
    this.initConfigurationForm();
    // this.paymentMethodService.reload();

     this.paymentsSpiList$ = this.paymentMethodService.getPaymentSpi();

     (document.querySelector(".btn-close") as HTMLButtonElement).addEventListener('click', () => this.resetForm())
  }

  ngOnChanges(changes: SimpleChanges): void {
    // this.resetForm()
    this.p1 = changes['p1']? changes['p1']?.currentValue : this.p1;
    
    if (this.p1 == 1) {
         this.providerId = changes['providerId'].currentValue ?? null;
        if (this.providerId) {
          this.loadConfigurations(this.providerId)
        }
    } 
  }


  initConfigurationForm() {
    this.configForm = this.fb.group({
      supportedCountries: ['', [Validators.required]],
      providerId: ['', [Validators.required]],
      name: ['', [Validators.required]],
      paymentMethodType: ['', [Validators.required]],
      configs: this.fb.group({})
    });;
  }

  // Selectionner un fournisseur
  selectProvider(provider:PaymentSpi) {
    this.initConfigurationForm();
    if (provider) {
        this.spiSelected = provider;
        this.configForm.patchValue({
          providerId: provider.providerId,
          name: provider.name,
          providerType: provider.providerType,
        });
        this.showConfigProperties(provider.configProperties)
    }
  }

  get configs():FormGroup {
    return this.configForm.get('configs') as FormGroup;
  }

  // Charge le formulaire de configuration
  showConfigProperties(configs:ConfigurationProperty[]) {
    configs.forEach((conf:any) => {
        let value: any = '';

        // valeur par défaut
        if (conf.defaultValue) {

          if (conf.type === 'MultivaluedList') {
            value = conf.defaultValue;
          } else {
            value = conf.defaultValue;
          }
        }

        const validators = [];
        if (conf.required) {
          validators.push(Validators.required);
        }

        this.configs.addControl(
          conf.name,
          new FormControl({ value, disabled: conf.readOnly }, validators)
        );
       
      });

  
  }


  loadConfigurations(id:any) {
      // Appel
      this.paymentMethodService.getPaymentProviderConfig(id).subscribe(
        (data) => {
           this.paymentMethodService.getPaymentSpiById(data.providerId).subscribe(
            (spi) => {
              if (spi) {
                //Select provider
                this.selectProvider(spi)
                this.configForm.patchValue({
                  providerId: data.providerId,
                  name: data.name,
                  providerType: data.providerType,
                  supportedCountries: data.supportedCountries,
                  paymentMethodType: data.paymentMethodType
              });

                Object.entries(data.configs).forEach(([k, v]) =>{
                  this.configs.get(k)?.patchValue(v)
                })
              }
            }
           )

        }
      )
      // Retrive
  }

  isChecked(name: string, value: string): boolean {
    const control = this.configs.get(name);
    if (!control?.value) return false;

    return control.value.split(';').includes(value);
  }

  onCheckboxChange(event: Event, name: string, value: string) {

    const control = this.configs.get(name);
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

    const newValue = current.join(';');

    control.setValue(newValue);
    control.markAsDirty();
    control.markAsTouched();
    control.updateValueAndValidity();
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



  save() {

    if (this.configForm.invalid) return;
    const payload = this.configForm.value;

    if (this.p1 == 0) {
      this.paymentMethodService.saveConfiguration(payload).subscribe(
          (success) => {
              this.message.success(messages.operation.success)
              this.resetForm();
              // this.loadConfigurations(this.p1);
              this.paymentMethodService.reload();
              this.closeModal();
          },
          (err) => this.message.error(messages.operation.error)
        )
    }  else {

    }

    
  }

  private closeModal() {
    const closeBtn = document.querySelector(".btn-close") as HTMLButtonElement;
    if (closeBtn) {
      closeBtn.click()
    }
  }

  resetForm() {
    // this.configForm.reset();
    this.spiSelected = null;
    this.providerId = null;
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

