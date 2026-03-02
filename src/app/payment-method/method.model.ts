export interface PaymentProvider {
    id:string;
    name: string,
    providerId:string,
    providerType:string;
    paymentMethodType:string;
    type:string;
    enabled:boolean;
    supportedCountries:string;
    configProperties:any[];

}


export interface ConfigurationProperty{
    name:string;
    type:string;
    label:string;
    helperText:string;
    defaultValue:string;
    options:any[];
    required:boolean;
    readOnly:boolean;
    secret:string
}

export interface PaymentSpi {
    name: string,
    providerId:string,
    providerType:string;
    configProperties:ConfigurationProperty[];
}
