import { HttpClient, HttpErrorResponse, HttpParams, HttpRequest } from "@angular/common/http";
import { BehaviorSubject, catchError, map, Observable, of, shareReplay, tap, throwError } from "rxjs";
import { Application } from "./application.model";
import { inject, Injectable } from "@angular/core";
import {environment} from './../../environments/environment';
import { Method } from "../payment-method/method.model";

@Injectable(
    {
        providedIn: "root"
    }
)
export class ApplicationService {
    private listSubject = new BehaviorSubject<Application[]>([]);
    list$:Observable<Application[]> = this.listSubject.asObservable();
    
    constructor(private httpClient:HttpClient) {
        this.list$ = this.getApplications();
        setInterval(()=> this.list$ = this.getApplications(),
        10000
        )
    }


    private getApplications():Observable<Application[]>{
        const url = environment.apiUrl  + "/apps";
        return  this.httpClient.get<Application[]>(url).pipe(
            shareReplay(1)
        )
    }

    private reloadApplications(){
        const url = environment.apiUrl  + "/apps";
        this.httpClient.get<Application[]>(url).subscribe(
            list => this.listSubject.next(list)
        )
    }

    public createApplication(data:any):Observable<Application> {
        const url = environment.apiUrl  + "/apps";
        return this.httpClient.post<Application>(url, JSON.stringify(data), {
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

    public activate(applicationId:string) {
        const url = `${environment.apiUrl}/apps/${applicationId}/activate`;
        return this.httpClient.post(url, null).pipe(
            tap(() => this.reloadApplications())
        )
    }

    public getList():Observable<Application[]>{
        return this.list$;
    }


    public getDetails(id:string):Observable<Application | null> {
        return this.list$.pipe(
                map(list => list.find(app => app.id === id) ?? null)
            )
    }

    public getPaymentMethods(id:string):Observable<Method[]> {
        const url = `${environment.apiUrl}/apps/${id}/methods`;

        return this,this.httpClient.get<Method[]>(url);
    }

    public updateApplication(body:any, applicationId:any) {
        // const url = '';
        // return this.httpClient.put(url, JSON.stringify(body));
    }

    public activateMethod(applicationId:string, methodId:string) {
        const url = `${environment.apiUrl}/apps/${applicationId}/payment-methods/${methodId}/enable`;

        return this.httpClient.post(url, null);
    }

    public showKey(applicationId:string) {
        const url = `${environment.apiUrl}/apps/${applicationId}/key`;
        return this.httpClient.get(url);
    }

    public saveSettings(id:string, data:any) {
        const url = `${environment.apiUrl}/apps/${id}/configurations`;
        return this.httpClient.post(url, JSON.stringify(data), {
           headers:{"Content-Type": "application/json"}
        });
    }


    public generateHmacKey(applicationId:string):Observable<any> {
        const url = `${environment.apiUrl}/apps/${applicationId}/configurations/generate-key`;

        return this.httpClient.post<any>(url, null);
    }
}