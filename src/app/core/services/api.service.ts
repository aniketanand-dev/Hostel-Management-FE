import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private baseUrl = environment.apiUrl;

    constructor(
        private http: HttpClient
    ) { }

    getData(endPoint: string): Observable<any> {
        //template literals with http client get methods 
        return this.http.get(`${this.baseUrl}/${endPoint}`)
    }

    postData(endPoint: string, payload: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/${endPoint}`, payload)
    }

    putData(endPoint: string, payload: any): Observable<any> {
        return this.http.put(`${this.baseUrl}/${endPoint}`, payload)
    }

    patchData(endPoint: string, payload: any): Observable<any> {
        return this.http.patch(`${this.baseUrl}/${endPoint}`, payload)
    }

    deleteData(endPoint: string, id?: any): Observable<any> {
        const url = id ? `${this.baseUrl}/${endPoint}/${id}` : `${this.baseUrl}/${endPoint}`;
        return this.http.delete(url);
    }
}
