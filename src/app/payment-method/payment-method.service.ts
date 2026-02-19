import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, shareReplay } from "rxjs";
import { ConfigForm, Method } from "./method.model";
import { environment } from "../../environments/environment";

@Injectable({providedIn: 'root'})
export class PaymentMethodService {
    private jsonUrl = 'assets/data.json';

    private list$:Observable<Method[]> = new Observable()
    constructor(private httpClient:HttpClient) {
        this.list$ = this.buildRequest();
    }

    public buildRequest():Observable<Method[]>{
        const url = environment.apiUrl + '/payment-methods'
        return this.httpClient.get<Method[]>(url).pipe(
            // shareReplay(1)
        )
    }

    getFormConfig(): Observable<ConfigForm[]> {
        return this.httpClient.get<ConfigForm[]>(this.jsonUrl);
    }

    public getList():Observable<Method[]> {
        return this.list$;
    }

    public saveConfiguration(data:any, id:string) {
        console.log(data)
        let params = new HttpParams()
        .set("country", data.countryCode)
        .set("key", data.key)
        .set("value", data.value)
        .set("encrypted", data.encrypted);
        
        
        const url = `${environment.apiUrl}/payment-methods/${id}/configurations`;

        return this.httpClient.post(url, null, {
            params: params
        })
    }

    public getConfigurations(id:string) {
        const url = `${environment.apiUrl}/payment-methods/${id}/configurations`
        return this.httpClient.get(url);
    }
}