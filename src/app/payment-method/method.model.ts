export interface Method {
    name: string,
    providerId:string,
    providerType:string;
    configProperties:ConfigurationProperty[];

}


export interface ConfigurationProperty{
    name:string;
    type:string;
    lable:string;
    helperText:string;
    defaultValue:string;
    options:any[];
    required:boolean;
    readonly:boolean;
    secret:string
}