
export class Utility {

    static convertMonney (number:number, currency:string)  {
        return  new Intl.NumberFormat('fr-FR', {
                style:'currency',
                currency: 'XOF',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(number)
    }

}

const logos = [
    {
      name: "wave", 
      url:'assets/images/logo_wave.png'
    },
    {
      name: "Mtn", 
      url:'assets/images/logo_momo_mtn.jpg'
    },
    {
      name: "Moov", 
      url:'assets/images/logo_moov.png'
    },
    {
      name: "Orange", 
      url:'assets/images/logo_om.png'
    }
  ]

  export const getPaymentMethodLogo = (name:string) =>{

    if (name) {
      let found = logos.find(elt => name.toLowerCase().includes(elt.name.toLowerCase()));
      return found? found.url : '#'
    }

    return '#';
  }


