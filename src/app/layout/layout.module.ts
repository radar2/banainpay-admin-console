import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Route, RouterModule} from '@angular/router';
import {DefaultLayoutComponent} from './../layout/default-layout';
import {DefaultFooterComponent} from './../layout/default-layout/default-footer/default-footer.component';
import {DefaultHeaderComponent} from './../layout/default-layout/default-header/default-header.component';


@NgModule({
  declarations: [DefaultLayoutComponent, DefaultFooterComponent, DefaultHeaderComponent],
  imports: [
    CommonModule, 
    
    RouterModule.forChild([])
  ]
})
export class ApplicationModule { }
