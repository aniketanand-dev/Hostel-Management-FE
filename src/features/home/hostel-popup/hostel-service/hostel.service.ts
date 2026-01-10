import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../../../app/core/services/api.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class HostelService {


    private apiService = inject(ApiService);

    getUserRolesByHostel(payload: number): Observable<any> {
        return this.apiService.getData(`user-role`);
    }
}
