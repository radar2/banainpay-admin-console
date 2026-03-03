import { Injectable, signal } from "@angular/core";

@Injectable({
    providedIn:"root"
})
export class ProviderState {
    private readonly _p1 = signal(0); // Ajout ou Mise a jour
    private readonly _p2 = signal(null); // ID provider

    readonly p1 = this._p1.asReadonly();
    readonly p2 = this._p2.asReadonly();

    update(p2:any) {
        this._p1.set(1)
        this._p2.set(p2)
    }


}