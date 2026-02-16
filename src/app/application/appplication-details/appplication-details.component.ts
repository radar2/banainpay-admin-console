import { Component, OnInit, signal } from '@angular/core';
import { ApplicationGemeralComponent } from '../application-gemeral/application-gemeral.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApplicationStateService } from '../application-state.service';
import { inject } from '@angular/core/primitives/di';
import { CommonModule } from '@angular/common';
import { ApplicationService } from '../application.service';
import { Application } from '../application.model';
@Component({
  selector: 'app-appplication-details',
  imports: [
    CommonModule,
    ApplicationGemeralComponent,
    RouterModule
  ],
  templateUrl: './appplication-details.component.html',
  styleUrl: './appplication-details.component.scss',
})
export class AppplicationDetailsComponent implements OnInit{
  // private state = inject(ApplicationStateService)
  application:Application | null = null;

  constructor(private route:ActivatedRoute, 
    private router:Router,
    private state:ApplicationStateService,
    private applicationSerice:ApplicationService  
  ){
     
  }
  ngOnInit(): void {
    let p1 = this.route.snapshot.paramMap.get('p1');
    
    if (p1) {
      this.loadAppplication(p1);
      this.state.setApplicationId(p1);
    }
  }

  loadAppplication(applicationId:string) {
    this.applicationSerice.getDetails(applicationId).subscribe(
      (application) => {
        this.application = application;
        this.state.set(this.application!)
      }
    )
  }

  goToPayments() {
    if (this.application) {
      this.router.navigate(['/applications/details', this.application.id, 'payments'])
    }
  }

  goToGeneral() {
   if (this.application) {
      this.router.navigate(['/applications/details', this.application.id, 'infos'])
    }
  }
}
