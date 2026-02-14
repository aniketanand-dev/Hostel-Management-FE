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

    getStaffById(id: string) {
        return this.apiService.getData(`staffs/${id}`);
    }

    verifyAadhaar(aadhaarNumber: string, name: string): Observable<any> {
        return this.apiService.postData('verify-aadhaar', { aadhaarNumber, name });
    }

    verifyAadhaarOtp(otp: string, clientId: string): Observable<any> {
        return this.apiService.postData('verify-aadhaar-otp', { otp, clientId });
    }

    verifyOfflineKyc(formData: FormData): Observable<any> {
        return this.apiService.postData('verify-offline-kyc', formData);
    }
}
