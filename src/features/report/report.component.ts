import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/materials/materials.module';
import { MatTabsModule } from '@angular/material/tabs';
import { ApiService } from '../../app/core/services/api.service';
import { FormControl } from '@angular/forms';
import { ExportService } from '../../app/core/services/export.service';

@Component({
    selector: 'app-report',
    imports: [CommonModule, MaterialModule, MatTabsModule],
    templateUrl: './report.component.html',
    styleUrl: './report.component.scss'
})
export class ReportComponent implements OnInit {
    // Filters
    monthControl = new FormControl(new Date().getMonth() + 1);
    yearControl = new FormControl(new Date().getFullYear());

    months = [
        { val: 1, name: 'January' }, { val: 2, name: 'February' }, { val: 3, name: 'March' },
        { val: 4, name: 'April' }, { val: 5, name: 'May' }, { val: 6, name: 'June' },
        { val: 7, name: 'July' }, { val: 8, name: 'August' }, { val: 9, name: 'September' },
        { val: 10, name: 'October' }, { val: 11, name: 'November' }, { val: 12, name: 'December' }
    ];

    // Data
    feeData: any[] = [];
    attData: any[] = [];
    isLoading = false;

    feeColumns = ['name', 'bed', 'rent', 'paid', 'due', 'status'];
    attColumns = ['name', 'present', 'absent', 'leave', 'late'];

    constructor(
        private api: ApiService,
        private exportService: ExportService
    ) { }

    ngOnInit(): void {
        this.loadFeeReport();
        this.loadAttendanceReport();
    }

    loadFeeReport() {
        this.isLoading = true;
        const q = `reports/fees?month=${this.monthControl.value}&year=${this.yearControl.value}`;
        this.api.getData(q).subscribe({
            next: (res: any) => {
                this.feeData = res.data;
                this.isLoading = false;
            },
            error: () => this.isLoading = false
        });
    }

    loadAttendanceReport() {
        this.isLoading = true;
        const q = `reports/attendance?month=${this.monthControl.value}&year=${this.yearControl.value}`;
        this.api.getData(q).subscribe({
            next: (res: any) => {
                this.attData = res.data;
                this.isLoading = false;
            },
            error: () => this.isLoading = false
        });
    }

    refresh() {
        this.loadFeeReport();
        this.loadAttendanceReport();
    }

    exportFees() {
        if (this.feeData.length === 0) return;
        const data = this.feeData.map(f => ({
            Student: f.name,
            Bed: f.bedNo,
            Rent: f.rent,
            Paid: f.paid,
            Due: f.due,
            Status: f.status
        }));
        this.exportService.downloadCSV(data, `fee_report_${this.monthControl.value}_${this.yearControl.value}`);
    }

    exportAttendance() {
        if (this.attData.length === 0) return;
        const data = this.attData.map(a => ({
            Student: a.name,
            Present: a.present,
            Absent: a.absent,
            Leave: a.leave,
            Late: a.late
        }));
        this.exportService.downloadCSV(data, `attendance_report_${this.monthControl.value}_${this.yearControl.value}`);
    }
}
