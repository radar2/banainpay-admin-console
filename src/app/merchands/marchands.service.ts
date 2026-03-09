import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, shareReplay, catchError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Marchands } from './marchands.model';

@Injectable({
  providedIn: 'root',
})
export class MarchandsService {
    private listSubject = new BehaviorSubject<Marchands[]>([]);
    list$:Observable<Marchands[]> = this.listSubject.asObservable();
    
    constructor(private httpClient:HttpClient) {
        this.list$ = this.getMarchands();
        setInterval(()=> this.list$ = this.getMarchands(),
        10000
        )
    }


    private getMarchands():Observable<Marchands[]>{
        const url = environment.apiUrl  + "/merchants";
        return  this.httpClient.get<Marchands[]>(url).pipe(
            shareReplay(1)
        )
    }

    public AddMarchand(data:any):Observable<Marchands> {
      const url = environment.apiUrl  + "/merchants";
      return this.httpClient.post<Marchands>(url, JSON.stringify(data), {
          headers:{
              'Content-Type':'application/json'
          }
      }).pipe(
          catchError(err => {
              if (err instanceof HttpErrorResponse && (err.status == 400 || err.status == 500)) {
                  throw(err.error.message)
              }

              throw(err)
          })
      )
    }

    public getList():Observable<Marchands[]>{
        return this.list$;
    }



}
