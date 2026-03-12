export interface Application {
    id:string;
    name:string;
    description:string;
    countryCode:string;
    active:boolean;
    webhook:Webhook;
    settlement:Settlement;
    feesRate:number;
    createdDate:string;
}

export interface Settlement {
    type:string;
    mobileMoneyNumber:string;
}


export interface Webhook {
    url:string;
    hmacKey:string;
}