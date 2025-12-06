import { Component, inject } from '@angular/core';
import { ApiService } from '../../app/core/services/api.service';
@Component({
    selector: 'app-dashboard',
    imports: [],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

    private api = inject(ApiService);
    features: any[] = [];

    constructor() {
        //this.api.getData('home').subscribe({
        //    next: (res: any) => {
        //        this.features = res.data.features;
        //    },
        //    error: (err) => console.error(err)
        //});
    }
}
