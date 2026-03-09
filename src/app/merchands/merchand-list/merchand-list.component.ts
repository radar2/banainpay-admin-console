import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NzTableModule } from 'ng-zorro-antd/table';
import { Marchands } from '../marchands.model';
import { Observable } from 'rxjs';
import { MarchandsService } from '../marchands.service';

@Component({
  selector: 'app-merchand-list',
  // standalone:true,
  imports: [CommonModule, RouterModule, NzTableModule],
  templateUrl: './merchand-list.component.html',
  styleUrl: './merchand-list.component.scss',
})
export class MerchandListComponent  implements OnInit{
  constructor(private router: Router, private marchandsService:MarchandsService){}

  // private readonly applicationService = inject(ApplicationService);

  list$:Observable<Marchands[]> = new Observable();
  applications:Marchands[] = [];


  ngOnInit(): void {
    this.list$ = this.marchandsService.list$;

    this.list$.subscribe(
      (data) => this.applications = data
    )

    // console.log(this.applications);
  }

}
