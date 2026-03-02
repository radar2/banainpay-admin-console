import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, shareReplay, of } from "rxjs";
import { PaymentProvider, PaymentSpi } from "./method.model";
import { environment } from "../../environments/environment";

@Injectable({providedIn: 'root'})
export class PaymentMethodService {
    private jsonUrl = 'assets/data.json';

    // private list$:Observable<PaymentProvider[]> = new Observable()
    private paymentsSpi$:Observable<PaymentSpi[]> = of([]);

    constructor(private httpClient:HttpClient) {
        // this.list$ = this.buildRequest();
        this.paymentsSpi$ = this.buildPaymentProvidersInterfaceRequest();
    }

    // public buildRequest():Observable<PaymentProvider[]>{
    //     const url = environment.apiUrl + '/payment-methods'
    //     return this.httpClient.get<PaymentProvider[]>(url).pipe(
    //         // shareReplay(1)
    //     )
    // }

    getFormConfig(): Observable<PaymentProvider[]> {
        const url = `${environment.apiUrl}/spi/providers`;
        return this.httpClient.get<PaymentProvider[]>(url);
    }

    getPaymentProviders(): Observable<PaymentProvider[]> {
    const url = `${environment.apiUrl}/spi/providers`;
    return this.httpClient.get<PaymentProvider[]>(url);
    }


    public saveConfiguration(data:any) {
        
        const url = `${environment.apiUrl}/spi/providers`;

        return this.httpClient.post(url, JSON.stringify(data), {
            headers:{"Content-Type":"application/json"}
        })
    }


    private buildPaymentProvidersInterfaceRequest():Observable<PaymentSpi[]> {
        const url = `${environment.apiUrl}/spi`;

        return this.httpClient.get<PaymentSpi[]>(url);
    }

    getPaymentSpi():Observable<PaymentSpi[]>{
        return this.paymentsSpi$;
    }
}