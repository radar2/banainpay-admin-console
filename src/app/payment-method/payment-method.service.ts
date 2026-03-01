import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, shareReplay, of } from "rxjs";
import { Method, PaymentProvider } from "./method.model";
import { environment } from "../../environments/environment";

@Injectable({providedIn: 'root'})
export class PaymentMethodService {
    private jsonUrl = 'assets/data.json';

    private list$:Observable<Method[]> = new Observable()
    private providersList$:Observable<PaymentProvider[]> = of([]);

    constructor(private httpClient:HttpClient) {
        this.list$ = this.buildRequest();
        this.providersList$ = this.buildPaymentProviders();
    }

    public buildRequest():Observable<Method[]>{
        const url = environment.apiUrl + '/payment-methods'
        return this.httpClient.get<Method[]>(url).pipe(
            // shareReplay(1)
        )
    }

    getFormConfig(): Observable<PaymentProvider[]> {
        const url = `${environment.apiUrl}/spi/providers`;
        return this.httpClient.get<PaymentProvider[]>(url);
    }

    getProviderComponents(): Observable<PaymentProvider[]> {
    const url = `${environment.apiUrl}/spi/providers/components`;
    return this.httpClient.get<PaymentProvider[]>(url);
    }

    public getList():Observable<Method[]> {
        return this.list$;
    }

    public saveConfiguration(data:any) {
        // console.log(data)
        // let params = new HttpParams()
        // .set("country", data.countryCode)
        // .set("key", data.key)
        // .set("value", data.value)
        // .set("encrypted", data.encrypted);
        
        
        const url = `${environment.apiUrl}/spi`;

        return this.httpClient.post(url, JSON.stringify(data), {
            headers:{"Content-Type":"application/json"}
        })
    }

    public getConfigurations(id:string) {
        const url = `${environment.apiUrl}/payment-methods/${id}/configurations`
        return this.httpClient.get(url);
    }

    private buildPaymentProviders():Observable<PaymentProvider[]> {
        const url = `${environment.apiUrl}/spi`;

        return this.httpClient.get<PaymentProvider[]>(url);
    }

    getPaymentProviders():Observable<PaymentProvider[]>{
        return this.providersList$;
    }
}