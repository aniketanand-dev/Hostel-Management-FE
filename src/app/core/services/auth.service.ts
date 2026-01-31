import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private loginEndpoint = 'login';
    private isBrowser: boolean;

    // BehaviorSubject to track login state
    private loggedIn = new BehaviorSubject<boolean>(false);
    public isLoggedIn$ = this.loggedIn.asObservable();

    private currentUser = new BehaviorSubject<any>(null);
    public currentUser$ = this.currentUser.asObservable();

    constructor(
        private apiService: ApiService,
        private router: Router,
        @Inject(PLATFORM_ID) platformId: Object
    ) {
        this.isBrowser = isPlatformBrowser(platformId);
        if (this.isBrowser) {
            const hasToken = this.hasToken();
            this.loggedIn.next(hasToken);
            if (hasToken) {
                const user = localStorage.getItem('user');
                if (user) {
                    this.currentUser.next(JSON.parse(user));
                }
            }
        }
    }

    login(payload: { email: string, password: string }) {
        return this.apiService.postData(this.loginEndpoint, payload);
    }

    saveToken(token: string, user?: any): void {
        if (this.isBrowser) {
            localStorage.setItem('token', token);
            if (user) {
                localStorage.setItem('user', JSON.stringify(user));
                this.currentUser.next(user);
            }
            this.loggedIn.next(true);
        }
    }

    getUser(): any {
        if (this.isBrowser) {
            const user = localStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        }
        return null;
    }

    getRole(): string | null {
        const user = this.getUser();
        return user ? user.role : null;
    }

    getToken(): string | null {
        if (this.isBrowser) {
            return localStorage.getItem('token');
        }
        return null;
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    logout(): void {
        if (this.isBrowser) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            this.loggedIn.next(false);
            this.currentUser.next(null);
            this.router.navigate(['auth/login']);
        }
    }

    // helper to check if token exists
    private hasToken(): boolean {
        if (this.isBrowser) {
            return !!localStorage.getItem('token');
        }
        return false;
    }
}
