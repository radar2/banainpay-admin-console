export interface Payment {
    id:string;
    reference:string;
    amount:number;
    currency:string;
    appId:string;
    reason?:string;
    paymentMethod:PaymentMethod;
    paymentMethodType:string;
    occurredOn:string;
    state:string;
    failureReason?:string;
    country:string;
    payer?:any;
    fees:Fees;
    events:any[];
}

export interface PaymentMethod {
    name:string;
    type:string;
    providerId:string
}

export interface Fees {
    number:string;
    currency:number
}


export interface Transaction {
    id:string;
    walletId:string;
    paymentId:string;
    type:string;
    amount:number;
    currency:string;
    occurredOn:string;
}