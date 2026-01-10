import { Injectable } from '@angular/core';
import { ApiService } from '../../../app/core/services/api.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(
        private apiService: ApiService
    ) { }

    forgetPassword(payload: Object) {
        return this.apiService.postData('forget/password', payload);
    }

    verifyOtp(payload: Object) {
        return this.apiService.postData('otp/verify', payload);
    }

    resetPassword(payload: Object) {
        return this.apiService.postData('resetPassword', payload);
    }
}
