import { Directive } from "@angular/core";
import { AbstractControl, ValidationErrors, Validator } from "@angular/forms";

@Directive({
    selector:'receivingPhoneNumberValidator'
})
export class RequiredReceivingPhoneNumberValidator implements Validator {

    validate(control: AbstractControl): ValidationErrors | null {
        return null;
    }

}