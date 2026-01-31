import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../app/core/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../app/core/services/auth.service';
import { HostelPopupComponent } from './hostel-popup/hostel-popup.component';
import { Router } from '@angular/router';
import { MaterialModule } from '../../shared/materials/materials.module';
import { AddHostelDialogComponent } from './add-hostel-dialog/add-hostel-dialog.component';

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
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadHostels();
    }

    loadHostels() {
        this._api.getData('hostels').subscribe({
            next: (res: HomeApiData) => {
                console.log(res);
                this.data = res;
                this.tokens = res?.tokens;
            }
        });
    }

    openAddHostelDialog() {
        const dialogRef = this.dialog.open(AddHostelDialogComponent, {
            width: '500px'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                // Refresh list if added successfully
                this.loadHostels();
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
                    this.authService.saveToken(roleToken);
                    this.router.navigate(['dashboard']);
                    return;
                }

                this.dialog.open(HostelPopupComponent, {
                    data: {
                        hostelName: item.hostelName,
                        hostelId: item.hostelId,
                        roles
                    }
                }).afterClosed().subscribe(result => {
                    if (result) {
                        this.authService.saveToken(result);
                        this.router.navigate(['dashboard']);
                    }
                });
            }
        });
    }

    logout() {
        this.authService.logout();
    }
}
