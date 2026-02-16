import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs"
import { Application } from "./application.model";

@Injectable({providedIn:'root'})
export class ApplicationStateService {
    private applicationId$ = new BehaviorSubject<string | null>(null);
    private application$ = new BehaviorSubject<Application | null>(null);

    setApplicationId(id: string) {
        this.applicationId$.next(id)
    }

    getApplicationId() {
        return this.applicationId$.asObservable();
    }

    set(application:Application) {
        this.application$.next(application);
    }

    get() {
        return this.application$.asObservable();
    }
}