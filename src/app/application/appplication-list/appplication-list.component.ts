import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core/primitives/di';
import { Router, RouterModule } from '@angular/router';
import {ApplicationService} from './../application.service';
import { Application } from '../application.model';
import { Observable, subscribeOn } from 'rxjs';
import { NzTableModule } from 'ng-zorro-antd/table';

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

  constructor(private router: Router, private applicationService:ApplicationService){}

  ngOnInit(): void {
    this.list$ = this.applicationService.list$;

    this.list$.subscribe(
      (data) => this.applications = data
    )
  }

  activateApplication(id:string) {
      this.applicationService.activate(id).subscribe(
        (data) => {
          console.log(data)
        }
      )
  }

}
