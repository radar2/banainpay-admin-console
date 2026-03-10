import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core/primitives/di';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {ApplicationService} from './../application.service';
import { Application } from '../application.model';
import { Observable, subscribeOn } from 'rxjs';
import { NzTableModule } from 'ng-zorro-antd/table';
import {NzMessageService} from 'ng-zorro-antd/message';
import { messages } from '../../messages';

@Component({
  selector: 'app-appplication-list',
  standalone:true,
  imports: [CommonModule, RouterModule, NzTableModule],
  templateUrl: './appplication-list.component.html',
  styleUrl: './appplication-list.component.scss',
})
export class AppplicationListComponent implements OnInit{

  // private readonly applicationService = inject(ApplicationService);

  list$:Observable<Application[]> = new Observable();
  applications:Application[] = [];

  constructor(private message:NzMessageService, private router: Router, private applicationService:ApplicationService,private route:ActivatedRoute){}

  idMarchand:any;
  p1:any = 0;

  ngOnInit(): void {

    
     this.p1 = this.route.snapshot.paramMap.get('p1');

    if ( this.p1==0 ) {
      this.idMarchand = this.route.snapshot.paramMap.get('p2');
      
      if(this.idMarchand){      
          this.applicationService.getAppsByMarchands(this.idMarchand).subscribe(
            (data) =>{ 
              this.applications = data;
              console.log(this.applications);
            }
          )

      }
    }else if ( this.p1==1 ) {
      this.applicationService.list$.subscribe(
        (data) => this.applications = data
      )
    }
    else if ( this.p1==2 ) {
      this.applicationService.getCurrentMarchandApps().subscribe(
        (data) => {this.applications = data;
          console.log(this.applications);
        }
      )
    }







 
  }

  activateApplication(id:string) {
      this.applicationService.activate(id).subscribe(
        (data) => {
          this.message.success(messages.operation.success)
          console.log(data)
        }, 
        (err) =>  this.message.success(messages.operation.error)
      )
  }

}
