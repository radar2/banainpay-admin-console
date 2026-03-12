import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { FormModule } from '@coreui/angular';
import { Subject, takeUntil } from 'rxjs';
import { ApplicationStateService } from '../../application-state.service';
import { Application } from '../../application.model';
import { ApplicationService } from '../../application.service';

@Component({
  selector: 'app-application-keys-percent',
  imports: [CommonModule, FormModule, ReactiveFormsModule],
  templateUrl: './application-keys-percent.component.html',
  styleUrl: './application-keys-percent.component.scss',
})
export class ApplicationKeysPercentComponent implements OnInit, OnDestroy{
  fb = inject(NonNullableFormBuilder);

   private state = inject(ApplicationStateService);

   
  key = '';
  application:Application | null = null;
  destroy$ = new Subject<void>();
  loading = false;
  settingForm = this.fb.group({
    webhookUrl: this.fb.control(""),
    webhookHmacKey: this.fb.control(""),
    rate:  this.fb.control(0.0, [Validators.required]),
    settlementType:this.fb.control('ON_DEMAND', [Validators.required]),
    fundingNumber:this.fb.control("", [this.requiredPhoneNumberValidator()])
  })

  constructor(private applicationService:ApplicationService) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.settingForm.updateValueAndValidity();
    this.state.get().subscribe(
      (data) => {
        
        if (data) {
          this.application = data!
          
          this.settingForm.patchValue({
            webhookUrl: this.application.webhook?.url,
            webhookHmacKey: this.application.webhook?.hmacKey,
            settlementType: this.application.settlement.type,
            fundingNumber: this.application.settlement.mobileMoneyNumber,
            rate: this.application.feesRate
          });
        }
      }
    )

    this.rate.disable()
    this.webhookHmacKey.disable()

    this.settlementType.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.settingForm.get('fundingNumber')!.updateValueAndValidity();
    })
  }


  get webhookUrl():AbstractControl {
    return  this.settingForm.get("webhookUrl")!;
  }

  get rate():AbstractControl  {
    return  this.settingForm.get("rate")!;
  }

  get settlementType():AbstractControl {
    return  this.settingForm.get("settlementType")!;
  }

  get fundingNumber():AbstractControl {
    return  this.settingForm.get("fundingNumber")!;
  }

  get webhookHmacKey():AbstractControl {
    return  this.settingForm.get("webhookHmacKey")!;
  }

  public showKey() {
    if (this.application) {
      this.applicationService.showKey(this.application.id).subscribe(
        (data:any) => {
          this.key = data.key
        }
      )
    }
  }

  requiredPhoneNumberValidator() {
    return (control: AbstractControl): ValidationErrors | null => {

    if (!control.parent) {
      return null; 
    }

    const mode = control.parent.get('settlementType')?.value;
    const value = control.value?.trim();

    if (!value && mode !== 'ON_DEMAND') {
      return { required: true };
    }

    return null;
  };
  }


  saveSettings() {
    console.log(this.settingForm.value)
    console.log(this.fundingNumber)
    if (!this.settingForm.valid) {
      Object.values(this.settingForm.controls).forEach(control => {
        if (!control.valid) {
          control.markAllAsDirty();
          control.updateValueAndValidity({onlySelf: true})
        }
      })
      return;
    }
    if (this.application) {
      this.loading = true;
      this.applicationService.saveSettings(
        this.application.id, this.settingForm.value!).subscribe(
          (success) => {
            this.loading = false;
          },
          (err)=> {
            console.log(err);
            this.loading = false;
          }
        )
    } 
  }

  generateNewHmacKey() {
    if (this.application) {
      this.applicationService.generateHmacKey(this.application.id).subscribe(
        (data) => {
          this.webhookHmacKey.patchValue(data.hmacKey);
        }
      )
    }
  }


}
