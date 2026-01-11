import { Component } from '@angular/core';
import { StaffService } from '../../app/core/services/staff.service';

import { MaterialModule } from '../../shared/materials/materials.module';

@Component({
    selector: 'app-staff',
    imports: [MaterialModule],
    templateUrl: './staff.component.html',
    styleUrl: './staff.component.scss'
})
export class StaffComponent {
    displayedColumns: string[] = ['id', 'name', 'email', 'action'];
    dataSource: any[] = [];

    constructor(private _staffService: StaffService) { }

    ngOnInit(): void {
        this._staffService.getStaff().subscribe(res => {
            this.dataSource = res.data
        });
    }

    editStudent(row: any) {
        console.log('Edit', row);
    }

    viewStudent(row: any) {
        console.log('View', row);
    }

    deleteStudent(row: any) {
        console.log('Delete', row);
    }
}
