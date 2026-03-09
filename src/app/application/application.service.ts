import { HttpClient, HttpErrorResponse, HttpParams, HttpRequest } from "@angular/common/http";
import { BehaviorSubject, catchError, map, Observable, of, shareReplay, tap, throwError } from "rxjs";
import { Application } from "./application.model";
import { inject, Injectable } from "@angular/core";
import {environment} from './../../environments/environment';
import { PaymentProvider } from "../payment-method/method.model";

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

    public getCurrentMarchandApps():Observable<Application[]>{
        const url = environment.apiUrl  + "/merchants/applications";
        this.list$ =  this.httpClient.get<Application[]>(url).pipe(
            // shareReplay(1)
        )
        return  this.list$;
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

    public getAppsByMarchands(id:string):Observable<Application[]> {
        const url = `${environment.apiUrl}/merchants/${id}/applications`;

        return this,this.httpClient.get<Application[]>(url);
    }

    public getPaymentMethods(id:string):Observable<PaymentProvider[]> {
        const url = `${environment.apiUrl}/apps/${id}/payment-providers`;

        return this,this.httpClient.get<PaymentProvider[]>(url);
    }

    public updateApplication(body:any, applicationId:any) {
        // const url = '';
        // return this.httpClient.put(url, JSON.stringify(body));
    }

    public addPaymentProviderToApplication(applicationId:string, providerId:string) {
        const url = `${environment.apiUrl}/apps/${applicationId}/payment-providers/${providerId}`;

        return this.httpClient.post(url, null);
    }

    public removePaymentProviderFromApplication(applicationId:string, providerId:string) {
        const url = `${environment.apiUrl}/apps/${applicationId}/payment-providers/${providerId}`;

        return this.httpClient.delete(url);
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