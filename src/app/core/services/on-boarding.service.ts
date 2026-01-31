import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class OnBoardingService {

    constructor(
        private apiService: ApiService
    ) { }

    createBuilding(payload: any): Observable<any> {
        return this.apiService.postData('building', payload);
    }

    getBuilding(): Observable<any> {
        return this.apiService.getData('building');
    }

    updateBuilding(id: number, payload: any): Observable<any> {
        return this.apiService.putData(`building/${id}`, payload);
    }

    deleteBuilding(id: number): Observable<any> {
        return this.apiService.deleteData(`building/${id}`);
    }
}
