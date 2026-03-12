import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { FormModule } from '@coreui/angular';
import { Subject, takeUntil } from 'rxjs';
import { ApplicationStateService } from '../application-state.service';
import { Application } from '../application.model';
import { ApplicationService } from '../application.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'application-secrets',
  imports: [CommonModule, FormModule, ReactiveFormsModule],
  templateUrl: './application-secrets.component.html',
  styleUrl: './application-secrets.component.scss',
})
export class ApplicationSecretComponent implements OnInit, OnDestroy{
  fb = inject(NonNullableFormBuilder);

   private state = inject(ApplicationStateService);

   
  key = '';
  application:Application | null = null;
  destroy$ = new Subject<void>();
  loading = false;


  constructor(
    private message:NzMessageService,
    private applicationService:ApplicationService) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.state.get().subscribe(
      (data) => {
        
        if (data) {
          this.application = data!
        
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

  copy() {
    navigator.clipboard.writeText(this.key).then(v => {
        this.message.info("Copié")
    })
  }


}
