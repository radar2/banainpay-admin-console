import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, NonNullableFormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ApplicationStateService } from '../application-state.service';
import { Application } from '../application.model';
import { ApplicationService } from '../application.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'application-info',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './application-info.component.html',
  styleUrl: './application-info.component.scss',
})
export class ApplicationInfoComponent implements OnInit{
  private state = inject(ApplicationStateService);
  private fb = inject(NonNullableFormBuilder);
  applicationForm:FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    countryCode: ['', [Validators.required]],
    description: [''],

  })

  // application:Application | null = null;
  applicationId:string | null = null;

  constructor(
    private router:Router, 
    private applicationService:ApplicationService) {}

  ngOnInit(): void {
    this.state.get().subscribe(
      data => {
            
              if (data) {
                this.applicationId = data.id
                this.updateForm(data)
              }
            }
    )
    // this.state.getApplicationId().pipe(
    //   switchMap(id => this.applicationService.getDetails(id!))
    // )
    // .subscribe(
    //   data => {
            
    //           this.application = data
    //           if (this.application) {
    //             this.updateForm(this.application)
    //           }
    //         }
    // )
    
  }


  private updateForm(application:Application) {
    this.applicationForm.patchValue({
      name: application.name,
      countryCode: application.countryCode,
      description: application.description
    })
  }


  submit() {
    if(!this.applicationForm.valid) {
      Object.values(this.applicationForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf:true})
        }
      })

      return;
    }

   if (this.applicationId) {
      // this.applicationService.updateApplication(this.applicationForm.value, this.application.id!)
   }

  }
}
