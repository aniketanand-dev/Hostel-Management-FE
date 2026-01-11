import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from '../../../shared/materials/materials.module';
import { MatDialogModule } from '@angular/material/dialog';
import { HostelService } from './hostel-service/hostel.service';

@Component({
    selector: 'app-hostel-popup',
    imports: [MaterialModule, MatDialogModule],
    templateUrl: './hostel-popup.component.html',
    styleUrl: './hostel-popup.component.scss'
})
export class HostelPopupComponent {

    selectedRoleId: number | null = null;
    hostelData: any
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public HostelService: HostelService
    ) {
        this.HostelService.getUserRolesByHostel(0).subscribe({
            next: (res) => {
                this.hostelData = res.roles;
                console.log(this.hostelData);
            }
        })

    }

}
