import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, shareReplay, of, filter, find, map, BehaviorSubject, switchMap } from "rxjs";
import { PaymentProvider, PaymentSpi } from "./method.model";
import { environment } from "../../environments/environment";

@Injectable({providedIn: 'root'})
export class PaymentMethodService {
    private jsonUrl = 'assets/data.json';

    // private list$:Observable<PaymentProvider[]> = new Observable()
    private providersTrigger$ = new BehaviorSubject<void>(undefined); 
    private providers$:Observable<PaymentProvider[]> 
    public paymentsSpi$:Observable<PaymentSpi[]>;

    constructor(private httpClient:HttpClient) {
        this.paymentsSpi$ = this.buildPaymentProvidersInterfaceRequest().pipe(
            shareReplay(1)
        )
        
        this.providers$ = this.providersTrigger$.pipe(
            switchMap(() => this.buildPaymentProviderRequest()),
            shareReplay(1)
        )
        
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
        return this.providers$;
    }

    getPaymentProviderConfig(providerId:string):Observable<PaymentProvider> {
        const url = `${environment.apiUrl}/spi/providers/${providerId}/configs`;
        return this.httpClient.get<PaymentProvider>(url);
    }

    private buildPaymentProviderRequest() {
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

    getPaymentSpiById(id:string):Observable<PaymentSpi | null> {
        return this.paymentsSpi$.pipe(
            map(list => list.find(spi => spi.providerId == id) ?? null))
    }

    reload() {
        this.providersTrigger$.next();
    }
}