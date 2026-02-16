import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { Inject, Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class AnalyticsService {

    constructor(private httpClient:HttpClient) {
        
    }
    

    getTotalAmountPerProvider():Observable<any> {
        const url = `${environment.apiUrl}/analytics/payments/providers`;
        return this.httpClient.get<any>(url)
    }


    getTotalAmountPerMonthDuringLastTwelveMonths() {
         const url = `${environment.apiUrl}/analytics/payments/monthly`;
        return this.httpClient.get<any>(url)
    }

    getPaymentCountPerState():Observable<any[]> {
         const url = `${environment.apiUrl}/analytics/payments/state`;
        return this.httpClient.get<any[]>(url)
    }
}