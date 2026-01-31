import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(
        private apiService: ApiService
    ) { }

    createUser(payload: any): Observable<any> {
        return this.apiService.postData('user', payload);
    }

    updateUser(id: number, payload: any): Observable<any> {
        return this.apiService.putData(`user/${id}`, payload);
    }

    getStudent() {
        return this.apiService.getData("students");
    }

    getStudentById(id: string) {
        return this.apiService.getData(`students/${id}`);
    }
}
