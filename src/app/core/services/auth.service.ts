import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private loginEndpoint = 'login';

    // BehaviorSubject to track login state
    private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
    public isLoggedIn$ = this.loggedIn.asObservable();

    constructor(
        private apiService: ApiService,
        private router: Router
    ) { }

    login(payload: { email: string, password: string }) {
        return this.apiService.postData(this.loginEndpoint, payload);
    }

    saveToken(token: string): void {
        localStorage.setItem('token', token);
        this.loggedIn.next(true);
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    logout(): void {
        localStorage.removeItem('token');
        this.loggedIn.next(false);
        this.router.navigate(['auth/login']);
    }

    // helper to check if token exists
    private hasToken(): boolean {
        return !!localStorage.getItem('token');
    }
}
