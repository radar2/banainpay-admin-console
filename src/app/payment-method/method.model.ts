export interface Method {
    id:string;
    name: string,
    providerId:string,
    providerType:string;
    type:string;
    enabled:boolean;
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

export interface PaymentProvider {
    name: string,
    providerId:string,
    providerType:string;
    configProperties:ConfigurationProperty[];
}
