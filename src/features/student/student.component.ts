import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../app/core/services/user.service';
import { MaterialModule } from '../../shared/materials/materials.module';
import { MatTableDataSource } from '@angular/material/table';


import { ExportService } from '../../app/core/services/export.service';

import { Router } from '@angular/router';

@Component({
    selector: 'app-student',
    standalone: true,
    imports: [
        CommonModule,
        MaterialModule
    ],
    templateUrl: './student.component.html',
    styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {

    displayedColumns: string[] = ['id', 'name', 'email', 'action'];
    dataSource = new MatTableDataSource<any>([]);
    selectedUser: any = null;
    showDetailsModal = false;

    constructor(
        private userService: UserService,
        private exportService: ExportService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadStudents();
    }

    loadStudents() {
        this.userService.getStudent().subscribe(res => {
            this.dataSource.data = res.data;
        });
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    editStudent(row: any) {
        this.router.navigate(['/students/student-form'], {
            queryParams: { id: row.id, type: 'student' }
        });
    }

    viewStudent(row: any) {
        this.userService.getStudentById(row.id).subscribe(res => {
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

    goToRoom() {
        if (!this.selectedUser || !this.selectedUser.RoomAllocations || this.selectedUser.RoomAllocations.length === 0) return;

        const allocation = this.selectedUser.RoomAllocations[0];
        const floorId = allocation.bed?.room?.floorId;
        const buildingId = allocation.bed?.room?.floor?.buildingId;

        if (floorId && buildingId) {
            this.router.navigate(['/buildings/room'], {
                queryParams: { floorId, buildingId }
            });
            this.closeDetails();
        }
    }

    deleteStudent(row: any) {
        console.log('Delete', row);
    }

    exportData() {
        if (this.dataSource.data.length === 0) return;

        const data = this.dataSource.data.map(s => ({
            ID: s.id,
            Name: s.name,
            Email: s.email,
            Role: s.roleName,
            JoinDate: s.joinDate
        }));

        this.exportService.downloadCSV(data, 'students_list');
    }
}
