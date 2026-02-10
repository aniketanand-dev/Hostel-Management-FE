import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ApiService } from '../../app/core/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../app/core/services/auth.service';
import { HostelPopupComponent } from './hostel-popup/hostel-popup.component';
import { Router } from '@angular/router';
import { MaterialModule } from '../../shared/materials/materials.module';

interface TokenData {
    hostelName: string;
    roleName: string;
    token: string;
    hostelId: number;
}

interface HomeApiData {
    success: boolean;
    tokens: TokenData[];
}

@Component({
    selector: 'app-home',
    imports: [CommonModule, MaterialModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
    data!: HomeApiData;
    tokens: TokenData[] = [];
    constructor(
        private _api: ApiService,
        private dialog: MatDialog,
        private authService: AuthService,
        private router: Router,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            // Only load hostels if user is logged in
            if (this.authService.hasToken()) {
                this.loadHostels();
            } else {
                // Redirect to login if no token
                this.router.navigate(['/login']);
            }
        }
    }

    loadHostels() {
        this._api.getData('hostels').subscribe({
            next: (res: HomeApiData) => {
                console.log(res);
                this.data = res;
                this.tokens = res?.tokens;
            },
            error: (err) => {
                console.error('Error loading hostels:', err);
                // If unauthorized, redirect to login
                if (err.status === 401 || err.status === 403) {
                    this.authService.logout();
                    this.router.navigate(['/login']);
                }
            }
        });
    }

    openHostelPopup(item: any) {
        // save base hostel token if required
        this.authService.saveToken(item.token);

        this._api.getData(`user-role?hostelId=${item.hostelId}`).subscribe({
            next: (res: any) => {
                const roles = res.roles;

                // ✅ ONLY ONE ROLE → DIRECT LOGIN
                if (roles.length === 1) {
                    const roleToken = roles[0].token;
                    const roleName = roles[0].roleName || roles[0].name;
                    this.authService.saveToken(roleToken);
                    this.navigateBasedOnRole(roleName);
                    return;
                }

                this.dialog.open(HostelPopupComponent, {
                    data: {
                        hostelName: item.hostelName,
                        hostelId: item.hostelId,
                        roles
                    }
                }).afterClosed().subscribe((selectedToken: string) => {
                    if (selectedToken) {
                        this.authService.saveToken(selectedToken);
                        // Find the selected role to get its name
                        const selectedRole = roles.find((r: any) => r.token === selectedToken);
                        if (selectedRole) {
                            const roleName = selectedRole.roleName || selectedRole.name;
                            this.navigateBasedOnRole(roleName);
                        } else {
                            this.router.navigate(['dashboard']);
                        }
                    }
                });
            }
        });
    }

    navigateBasedOnRole(roleName: string) {
        const role = roleName.toUpperCase();
        if (role === 'STUDENT') {
            this.router.navigate(['complaints']);
        } else {
            this.router.navigate(['dashboard']);
        }
    }

    logout() {
        this.authService.logout();
    }
}
