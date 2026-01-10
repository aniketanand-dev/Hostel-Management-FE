import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../app/core/services/api.service';
import { NgForOf } from "../../../node_modules/@angular/common/common_module.d-NEF7UaHr";
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../app/core/services/auth.service';
import { HostelPopupComponent } from './hostel-popup/hostel-popup.component';
import { Router } from '@angular/router';

interface TokenData {
    hostelName: string;
    roleName: string;
    token: string;
}

interface HomeApiData {
    success: boolean;
    tokens: TokenData[];
}
@Component({
    selector: 'app-home',
    imports: [CommonModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {
    data!: HomeApiData;
    tokens: TokenData[] = [];
    constructor(
        private _api: ApiService,
        private dialog: MatDialog,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this._api.getData('hostels').subscribe({
            next: (res: HomeApiData) => {
                console.log(res);
                this.data = res;
                this.tokens = res?.tokens;
            }
        })
    }

    openHostelPopup(item: any) {
        console.log(item);
        this.authService.saveToken(item.token);
        this.dialog.open(HostelPopupComponent, {
            data: { hostelId: item }
        }).afterClosed().subscribe(result => {
            if (result) {
                console.log('Selected:', result);
                this.authService.saveToken(result);
                this.router.navigate(['dashboard'])
            }
        });

    }

}
