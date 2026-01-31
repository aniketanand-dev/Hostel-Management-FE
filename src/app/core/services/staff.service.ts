import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class StaffService {

    constructor(
        private apiService: ApiService
    ) { }

    createUser(payload: any): Observable<any> {
        return this.apiService.postData('user', payload);
    }

    getStaff() {
        return this.apiService.getData("staffs");
    }

    getStaffById(id: string) {
        return this.apiService.getData(`staffs/${id}`);
    }
}
