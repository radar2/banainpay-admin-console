import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ApplicationStateService } from '../application-state.service';
import { ApplicationService } from '../application.service';
import { switchMap } from 'rxjs';
import { FormModule } from '@coreui/angular';
import { AbstractControl, FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Application } from '../application.model';

@Component({
  selector: 'application-keys',
  imports: [CommonModule, FormModule, ReactiveFormsModule],
  templateUrl: './application-keys.component.html',
  styleUrl: './application-keys.component.scss',
})
export class ApplicationKeysComponent implements OnInit{
  fb = inject(NonNullableFormBuilder);

   private state = inject(ApplicationStateService);

   
  key = '';
  application:Application | null = null;
  webhookUrl = new FormControl('', [Validators.required]);
  rate = new FormControl('0.0', [Validators.required]);
  receivingMode = new FormControl('', [Validators.required]);
  receivingPhoneNumber = new FormControl('', [Validators.required]);

  loading = false;
  constructor(private applicationService:ApplicationService) {}

  ngOnInit(): void {
    this.state.get().subscribe(
      (data) => {
        
        if (data) {
          this.application = data!
          
          this.webhookUrl.patchValue(this.application.webhookUrl);
        }
      }
    )
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

  // requiredPhoneNumberValidator(control:AbstractControl):ValidationErrors | null {
      
  // }

  changeWebhookUrl() {
    
    if (!this.webhookUrl.valid) {
      this.webhookUrl.markAsDirty();
      this.webhookUrl.updateValueAndValidity({onlySelf:true})
      return;
    }
    if (this.application) {
      this.loading = true;
      this.applicationService.changeApplicationWebhookUrl(
        this.application.id, this.webhookUrl.value!).subscribe(
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



}
