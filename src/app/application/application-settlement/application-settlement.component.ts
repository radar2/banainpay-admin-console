import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FormModule } from '@coreui/angular';
import { Subject, takeUntil } from 'rxjs';
import { ApplicationStateService } from '../application-state.service';
import { Application } from '../application.model';
import { ApplicationService } from '../application.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { messages } from '../../messages';

@Component({
  selector: 'application-settlement',
  imports: [CommonModule, FormModule, ReactiveFormsModule],
  templateUrl: './application-settlement.component.html',
  styleUrl: './application-settlement.component.scss',
})
export class ApplicationSettlementComponent implements OnInit, OnDestroy{
  fb = inject(NonNullableFormBuilder);

  key = '';
  application:Application | null = null;
  destroy$ = new Subject<void>();
  loading = false;
  settingForm = this.fb.group({
    type:this.fb.control('ON_DEMAND', [Validators.required]),
    mobileMoneyNumber:this.fb.control("", [this.requiredPhoneNumberValidator()])
  })

  constructor(
    private message:NzMessageService,
    private state:ApplicationStateService,
    private applicationService:ApplicationService) {}

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
            type: this.application.settlement.type,
            mobileMoneyNumber: this.application.settlement.mobileMoneyNumber
          });
        }
      }
    )


    this.type.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.settingForm.get('mobileMoneyNumber')!.updateValueAndValidity();
    })
  }


  get type():AbstractControl {
    return  this.settingForm.get("type")!;
  }

  get mobileMoneyNumber():AbstractControl {
    return  this.settingForm.get("mobileMoneyNumber")!;
  }


  requiredPhoneNumberValidator() {
    return (control: AbstractControl): ValidationErrors | null => {

    if (!control.parent) {
      return null; 
    }

    const mode = control.parent.get('type')?.value;
    const value = control.value?.trim();

    if (!value && mode !== 'ON_DEMAND') {
      return { required: true };
    }

    return null;
  };
  }


  save() {
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
      this.applicationService.changeSettlement(
        this.application.id, this.settingForm.value!).subscribe(
          (data) => {
            this.message.success(messages.operation.success)
            this.application!.settlement = data;
            this.state.set(this.application!)
            this.loading = false;
          },
          (err)=> {
            this.message.error(messages.operation.error)
            this.loading = false;
          }
        )
    } 
  }

}

export function requiredPhoneNumberValidator():ValidatorFn {
  return (control: AbstractControl):ValidationErrors | null => {
      const value = control.value;

      if (!value && control.parent!.get("receivingMode")?.value !== 'on_demand') {
        return {required: true};
      }

      return {required: false};;
  }
}
