import { Component, OnInit } from '@angular/core';
import { StaffService } from '../../app/core/services/staff.service';
import { AuthService } from '../../app/core/services/auth.service';
import { ApiService } from '../../app/core/services/api.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/materials/materials.module';

@Component({
    selector: 'app-staff',
    imports: [MaterialModule, CommonModule],
    templateUrl: './staff.component.html',
    styleUrl: './staff.component.scss'
})
export class StaffComponent implements OnInit {
    displayedColumns: string[] = ['id', 'name', 'email', 'action'];
    dataSource: any[] = [];
    selectedUser: any = null;
    showDetailsModal = false;
    isSuperAdmin = false;

    constructor(
        private _staffService: StaffService,
        private auth: AuthService,
        private api: ApiService
    ) { }

    ngOnInit(): void {
        this.isSuperAdmin = this.auth.getRole() === 'SUPER_ADMIN';
        this.loadStaff();
    }

    promoteStaff(row: any) {
        if (confirm(`Are you sure you want to promote ${row.name} to ADMIN?`)) {
            this.api.postData('promote-admin', { userId: row.id }).subscribe({
                next: (res) => {
                    alert(res.message);
                    this.loadStaff();
                },
                error: (err) => {
                    alert(err.error?.message || 'Failed to promote staff');
                }
            });
        }
    }

    loadStaff() {
        this._staffService.getStaff().subscribe(res => {
            this.dataSource = res.data
        });
    }

    editStudent(row: any) {
        console.log('Edit', row);
    }

    viewStudent(row: any) {
        this._staffService.getStaffById(row.id).subscribe(res => {
            if (res.success) {
                this.selectedUser = res.data;
                this.showDetailsModal = true;
            }
        });
    }

    closeDetails() {
        this.showDetailsModal = false;
        this.selectedUser = null;
    }

    deleteStudent(row: any) {
        console.log('Delete', row);
    }
}
