import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder,
   FormGroup,
    NonNullableFormBuilder,
    ReactiveFormsModule,
    Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApplicationService } from '../application.service';
import { Application } from '../application.model';

@Component({
  selector: 'app-appplication-add',
  imports:[CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './appplication-add.component.html',
  styleUrl: './appplication-add.component.scss',
})
export class AppplicationAddComponent implements OnInit{
  private fb = inject(NonNullableFormBuilder);
  applicationForm:FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    countryCode: ['', [Validators.required]],
    description: [''],

  })

  loading = false;

  hasError = false;
  errorMessage = null;
  

  constructor(private router:Router, private applicaionService:ApplicationService) {}

  ngOnInit(): void {
    
  }


  submit() {
    this.loading = true;
    if(!this.applicationForm.valid) {
      Object.values(this.applicationForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf:true})
        }
      })
      this.loading = false;
      return;
    }


    this.applicaionService.createApplication(this.applicationForm.value).subscribe(
      (data:Application)=>{
        this.loading = false;
        this.router.navigateByUrl(`/applications/details/${data.id}/infos`)
      },
      (err) => {
        this.loading = false;
        this.hasError = true;
        console.log(err)
        this.errorMessage = err
      }
    )

   

  }

}
