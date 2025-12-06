import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../app/core/services/api.service';
import { NgForOf } from "../../../node_modules/@angular/common/common_module.d-NEF7UaHr";

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
        private _api: ApiService
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

}
