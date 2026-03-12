import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { FormModule } from '@coreui/angular';
import { Subject, takeUntil } from 'rxjs';
import { ApplicationStateService } from '../application-state.service';
import { Application } from '../application.model';
import { ApplicationService } from '../application.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { messages } from '../../messages';
import { keys } from 'lodash-es';

@Component({
  selector: 'application-webhook',
  imports: [CommonModule, FormModule, ReactiveFormsModule],
  templateUrl: './application-webhook.component.html',
  styleUrl: './application-webhook.component.scss',
})
export class ApplicationWebhookComponent implements OnInit, OnDestroy{
  fb = inject(NonNullableFormBuilder);

   private state = inject(ApplicationStateService);

   
  showHmacKey = false;
  application:Application | null = null;
  destroy$ = new Subject<void>();
  loading = false;
  settingForm = this.fb.group({
    webhookUrl: this.fb.control(""),
    webhookHmacKey: this.fb.control(""),
  })

  constructor(
    private message:NzMessageService,
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
            webhookUrl: this.application.webhook?.url,
            webhookHmacKey: this.application.webhook?.hmacKey
          });
        }
      }
    )

    this.webhookHmacKey.disable();

  }


  get webhookUrl():AbstractControl {
    return  this.settingForm.get("webhookUrl")!;
  }


  get webhookHmacKey():AbstractControl {
    return  this.settingForm.get("webhookHmacKey")!;
  }

 


  save() {
    if (!this.webhookUrl.valid) {
     this.webhookUrl.markAllAsDirty();
      this.webhookUrl.updateValueAndValidity({onlySelf: true})
      return;
    }
    if (this.application) {
      this.loading = true;
      this.applicationService.changeWebhook(
        this.application.id, this.webhookUrl.value).subscribe(
          (data) => {
            this.message.success(messages.operation.success)
            this.application!.webhook = data
            this.state.set(this.application!);
            this.showKey(data.hmacKey);
            this.loading = false;
          },
          (err)=> {
            this.message.error(messages.operation.error)
            this.loading = false;
          }
        )
    } 
  }

  generateNewHmacKey() {
    if (this.application) {
      this.applicationService.generateHmacKey(this.application.id).subscribe(
        (data) => {
          this.message.success(messages.operation.success)
          this.webhookHmacKey.patchValue(data.hmacKey);
        },
        (error) => {
          this.message.error(messages.operation.error)
        }
      )
    }
  }

  copy() {
    let keySpan = document.querySelector('#key') as HTMLSpanElement;
    if (keySpan) {
      navigator.clipboard.writeText(keySpan.innerText).then(v => {
      this.message.info('Copié')
    } )
    }
    
  }

showKey(key:string) {
  this.showHmacKey = true;
  let keySpan = document.querySelector('#key') as HTMLSpanElement;
  if (keySpan) {
    keySpan.innerText = key;
  }
}
}