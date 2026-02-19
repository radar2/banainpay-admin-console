import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigForm } from '../method.model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private jsonUrl = './data.json';

  constructor(private http: HttpClient) { }

  getFormConfig(): Observable<ConfigForm[]> {
    return this.http.get<ConfigForm[]>(this.jsonUrl);
  }
}
