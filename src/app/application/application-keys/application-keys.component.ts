import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ApplicationStateService } from '../application-state.service';
import { ApplicationService } from '../application.service';
import { switchMap } from 'rxjs';
import { FormModule } from '@coreui/angular';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Application } from '../application.model';

@Component({
  selector: 'application-keys',
  imports: [CommonModule, FormModule, ReactiveFormsModule],
  templateUrl: './application-keys.component.html',
  styleUrl: './application-keys.component.scss',
})
export class ApplicationKeysComponent implements OnInit{
  fb = inject(NonNullableFormBuilder);
  settingsForm:FormGroup = this.fb.group({
    webhookUrl: [null, []],
    rate:[null]
  })

   private state = inject(ApplicationStateService);

   
  key = '';
  application:Application | null = null;
  webhookUrl = new FormControl('', [Validators.required]);
  loading = false;
  constructor(private applicationService:ApplicationService) {}

  ngOnInit(): void {
    this.state.get().subscribe(
      (data) => {
        
        if (data) {
          this.application = data!
          this.settingsForm.patchValue({
            "webhookUrl": data.webhookUrl
          })
          // this.webhookUrl.patchValue(this.application.webhookUrl);
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
