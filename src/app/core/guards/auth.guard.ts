import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    canActivate(): boolean {
        // If server-side, allow the route so the correct page starts loading.
        // The real check will happen on the client where localStorage is available.
        if (!isPlatformBrowser(this.platformId)) {
            return true;
        }

        if (this.authService.isLoggedIn()) {
            return true;
        }

        this.router.navigate(['auth/login']);
        return false;
    }
}
