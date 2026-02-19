import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StoreConfigService {
  private _providers: Record<string, any> = {};

  set providers(data: any[]) {
    data.forEach(provider => {
      this._providers[provider.providerId] = provider;
    });
  }

  get all() {
    return this._providers;
  }

  getByProviderId(providerId: string) {
    return this._providers[providerId];
  }
}
