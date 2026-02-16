import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PaymentMethodService } from '../../payment-method.service';
import { NzTableModule } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-wave',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NzTableModule],
  templateUrl: './wave.component.html',
  styleUrl: './wave.component.scss',
})
export class WaveComponent implements OnInit{

  p1:any;
  p2:any;
  configurations:any[] = [];

  fb = inject(NonNullableFormBuilder);

  constructor(private route:ActivatedRoute,
     private paymentMethodService:PaymentMethodService) {}

  configForm:FormGroup = this.fb.group(
    {
      countryCode: ['', [Validators.required]],
      label: ['', [Validators.required]],
      value: ['', [Validators.required]],
      encrypted: [false]
    }
  )



  ngOnInit(): void {
    this.p1 = this.route.snapshot.paramMap.get('p1');
    console.log(this.p1)
    if (this.p1) {
      this.paymentMethodService.getConfigurations(this.p1).subscribe(
        (data:any) => this.configurations = data
      )

      // this.p2 = this.route.snapshot.paramMap.get('p2');
    }
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

    if (this.p1 == 0) {

      // Create
    } else if(this.p1 == 1 && this.p2) {
      // Update
    }

    
  }
}
