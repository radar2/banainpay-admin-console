export interface Method {
    id: string,
    name: string,
    description:string,
    provider:string,
    type:string,
    enabled:boolean
}

export interface ConfigForm {

    providerId: string,
    name: string,
    providerType: string,
    configProperties: ConfigPropertiesForm[]
}

export interface ConfigPropertiesForm {

    name: string,
    type: string,
    label: string,
    helperText: string,
    defaultValue: string,
    options: [],
    secret: boolean,
    required: boolean,
    readOnly: boolean
 
  }