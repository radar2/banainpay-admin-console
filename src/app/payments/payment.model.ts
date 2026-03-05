export interface Payment {
    id:string;
    reference:string;
    amount:number;
    currency:string;
    fees:number;
    feesRate:number;
    netAmount:number;
    
    appId:string;
    reason?:string;
    paymentMethod:PaymentMethod;
    paymentMethodType:string;
    occurredOn:string;
    state:string;
    failureReason?:string;
    country:string;
    payer?:any;
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