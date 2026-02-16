export class MoneyUtility {
    
    private constructor() {}

    public static format(amount:number, currency:string) {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 3,
        }).format(amount);
    }

    public static formatToXOF(amount:number) {
        return this.format(amount, 'XOF');
    }

}