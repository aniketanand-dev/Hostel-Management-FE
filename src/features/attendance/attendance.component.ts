import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MaterialModule } from '../../shared/materials/materials.module';
import { ApiService } from '../../app/core/services/api.service';
import { FormControl } from '@angular/forms';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
    selector: 'app-attendance',
    imports: [CommonModule, MaterialModule, MatDatepickerModule, MatNativeDateModule],
    providers: [DatePipe],
    templateUrl: './attendance.component.html',
    styleUrl: './attendance.component.scss'
})
export class AttendanceComponent implements OnInit {
    dateControl = new FormControl(new Date());
    students: any[] = [];
    isLoading = false;

    displayedColumns: string[] = ['name', 'status'];

    constructor(private api: ApiService, private datePipe: DatePipe) { }

    ngOnInit(): void {
        this.dateControl.valueChanges.subscribe(() => {
            this.loadAttendance();
        });
        this.loadAttendance();
    }

    loadAttendance() {
        const dateStr = this.datePipe.transform(this.dateControl.value, 'yyyy-MM-dd');
        this.isLoading = true;

        this.api.getData(`attendance?date=${dateStr}`).subscribe({
            next: (res: any) => {
                // Initialize status if NA to PRESENT (default expectation)
                this.students = res.data.map((s: any) => ({
                    ...s,
                    status: s.status === 'NA' ? 'PRESENT' : s.status
                }));
                this.isLoading = false;
            },
            error: (err) => {
                console.error(err);
                this.isLoading = false;
            }
        });
    }

    saveAttendance() {
        const dateStr = this.datePipe.transform(this.dateControl.value, 'yyyy-MM-dd');
        const records = this.students.map(s => ({
            userId: s.userId,
            status: s.status
        }));

        this.isLoading = true;
        this.api.postData('attendance', { date: dateStr, records }).subscribe({
            next: (res) => {
                this.isLoading = false;
                // Show snackbar success?
                alert('Attendance Saved Successfully');
            },
            error: (err) => {
                console.error(err);
                this.isLoading = false;
            }
        });
    }

    markAll(status: string) {
        this.students.forEach(s => s.status = status);
    }
}
