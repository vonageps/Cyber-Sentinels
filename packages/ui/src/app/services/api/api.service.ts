import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { IApiService } from "./i-api-service";

@Injectable({
  providedIn: "root",
})
export class ApiService implements IApiService {
  constructor(private readonly http: HttpClient) {}

  public post<T = any>(url: string, payload: any, options?: object): Observable<T> {
    return this.http.post<T>(`${url}`, payload, options);
  }

  public get<T = any>(url: string, options?: object): Observable<T> {
    return this.http.get<T>(`${url}`, options);
  }

  public patch(url: string, payload: any, options?: object): Observable<any> {
    return this.http.patch(`${url}`, payload, options);
  }

  public put(url: string, payload: any, options?: object): Observable<any> {
    return this.http.put(`${url}`, payload, options);
  }

  public delete(url: string, options?: object): Observable<any> {
    return this.http.delete(`${url}`, options);
  }
}
