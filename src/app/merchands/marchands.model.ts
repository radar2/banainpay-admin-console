export interface Marchands {
   
    id: string,
    name: string,
    address: {
      city: string,
      country: string
    },
    telephone: string,
    email: string,
    representativeName: {
      firstName: string,
      lastName: string
    }
}

export interface AddMarchand {    
    name: string,
    city: string,
    country: string,
    telephone: string,
    email: string,
    representationFirstName: string,
    representationLastName: string
}   