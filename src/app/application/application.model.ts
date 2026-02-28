export interface Application {
    id:string;
    name:string;
    description:string;
    countryCode:string;
    active:boolean;
    webhook:Webhook;
    settlement:Settlement;
    createdDate:string;
}

export interface Settlement {
    type:string;
    fundingNumber:string;
}


export interface Webhook {
    url:string;
    hmacKey:string;
}