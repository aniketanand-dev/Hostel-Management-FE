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

}
