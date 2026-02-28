import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, Observable, of } from "rxjs";
import { Payment, Transaction } from "./payment.model";
import { environment } from "../../environments/environment";
import { Injectable } from "@angular/core";
import { Wallet } from "./wallet.model";

@Injectable({providedIn:'root'})
export class PaymentService {
    constructor(private httpClient:HttpClient) {
        
    }

    getPaymentsHistory():Observable<Payment[]> {
        const url = `${environment.apiUrl}/admin/payments`;
        return this.httpClient.get<Payment[]>(url).pipe(
            catchError(err => {
                if (err && err instanceof HttpErrorResponse && err.status == 404) {
                    return of([]);
                }

                throw(err)
            })
        );
    }

    getPaymentsOfApplication(applicationId:string):Observable<Payment[]> {
        const url = `${environment.apiUrl}/admin/payments/applications/${applicationId}`;

        return this.httpClient.get<Payment[]>(url);
    }

    getBalanceOfApplication(applicationId:string):Observable<Wallet> {
        const url = `${environment.walletApiUrl}/wallets/${applicationId}`;
        return this.httpClient.get<Wallet>(url);
    }

    getTransactionHistory(applicationId:string):Observable<Transaction[]> {
        const url = `${environment.walletApiUrl}/ledgers/applications/${applicationId}/records`;

        return this.httpClient.get<Transaction[]>(url);
    }

    getAllTransactionsHistories():Observable<Transaction[]> {
        const url = `${environment.walletApiUrl}/ledgers/records`;

        return this.httpClient.get<Transaction[]>(url);
    }

    getGlobalBalance():Observable<any> {
        const url = `${environment.walletApiUrl}/wallets/global`;

        return this.httpClient.get<any>(url);
    }

    getPaltfomrBalance():Observable<any> {
        const url = `${environment.walletApiUrl}/wallets/platform`;

        return this.httpClient.get<any>(url);
    }

    getPaymentDetails(paymentId:string):Observable<Payment> {
        const url = `${environment.apiUrl}/admin/payments/${paymentId}`;

        return this.httpClient.get<Payment>(url);
    }
        

}