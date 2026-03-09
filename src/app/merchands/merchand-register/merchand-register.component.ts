import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Marchands } from '../marchands.model';
import { MarchandsService } from '../marchands.service';

@Component({
  selector: 'app-merchand-register',
  imports:[CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './merchand-register.component.html',
  styleUrl: './merchand-register.component.scss',
})
export class MerchandRegisterComponent {

    constructor(private router:Router, private marchandsService:MarchandsService) {}


    private fb = inject(NonNullableFormBuilder);

  applicationForm:FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    country: ['', [Validators.required]],
    telephone: ['', [Validators.required]],
    email: ['', [Validators.required]],
    city: ['', [Validators.required]],
    representationFirstName: ['', [Validators.required]],
    representationLastName:['', [Validators.required]],

  })

  
  loading = false;

  hasError = false;
  errorMessage = null;

  submit(){

    let form = this.applicationForm;


    this.loading = true;
    if(!form.valid) {
      Object.values(this.applicationForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf:true})
        }
      })
      this.loading = false;
      return;
    }


    this.marchandsService.AddMarchand(form.value).subscribe(
      (data:Marchands)=>{
        this.loading = false;
        console.log(data);
        this.router.navigateByUrl(`/merchands/list`)
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
