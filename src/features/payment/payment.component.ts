import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MaterialModule } from '../../shared/materials/materials.module';
import { ApiService } from '../../app/core/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { RecordPaymentDialogComponent } from './record-payment-dialog/record-payment-dialog.component';
import { PaymentHistoryDialogComponent } from './payment-history-dialog/payment-history-dialog.component';

import { ExportService } from '../../app/core/services/export.service';

@Component({
    selector: 'app-payment',
    imports: [CommonModule, MaterialModule],
    templateUrl: './payment.component.html',
    styleUrl: './payment.component.scss'
})
export class PaymentComponent implements OnInit {
    private api = inject(ApiService);
    private dialog = inject(MatDialog);
    private exportService = inject(ExportService);
    private platformId = inject(PLATFORM_ID);

    upcomingPayments: any[] = [];
    allStudents: any[] = [];
    isLoading = false;
    selectedTab = 0;
    displayedColumns: string[] = ['name', 'amount', 'dueDate', 'daysLeft', 'status', 'action'];
    allStudentsColumns: string[] = ['name', 'room', 'rent', 'totalPaid', 'action'];

    get currentList() {
        return this.selectedTab === 0 ? this.upcomingPayments : this.allStudents;
    }

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.loadUpcomingPayments();
        }
    }

    onTabChange(index: number) {
        this.selectedTab = index;
        if (index === 1 && this.allStudents.length === 0) {
            this.loadAllStudents();
        }
    }

    refreshCurrentView() {
        if (this.selectedTab === 0) {
            this.loadUpcomingPayments();
        } else {
            this.loadAllStudents();
        }
    }

    loadUpcomingPayments() {
        this.isLoading = true;
        this.api.getData('payment/upcoming').subscribe({
            next: (res: any) => {
                this.upcomingPayments = res.data;
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error fetching payments', err);
                this.isLoading = false;
            }
        });
    }

    loadAllStudents() {
        this.isLoading = true;
        this.api.getData('students').subscribe({
            next: (res: any) => {
                // Filter only students with active allocations
                this.allStudents = (res.data || [])
                    .filter((s: any) => s.RoomAllocations && s.RoomAllocations.length > 0)
                    .map((s: any) => {
                        // Use activeAllocation provided by backend or fallback to first
                        const alloc = s.activeAllocation || s.RoomAllocations[0];
                        return {
                            allocationId: alloc.id,
                            userName: s.name,
                            userEmail: s.email,
                            roomNumber: alloc.bed?.room?.roomNumber || 'N/A',
                            monthlyRent: alloc.monthlyRent,
                            totalPaid: s.totalPaid || 0,
                            // Pass full RoomAllocations array for history view
                            RoomAllocations: s.RoomAllocations
                        };
                    });
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error fetching students', err);
                this.isLoading = false;
            }
        });
    }

    recordPayment(element: any) {
        const dialogRef = this.dialog.open(RecordPaymentDialogComponent, {
            width: '500px',
            data: element
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.refreshCurrentView();
            }
        });
    }

    viewHistory(element: any) {
        // If element has RoomAllocations array (from All Students tab), pass that.
        // If element is from Upcoming Payments, it has allocationId but maybe not the array. Use allocationId.

        const dataForDialog = {
            allocationId: element.allocationId, // specific allocation
            userName: element.userName || element.name,
            // If we have full list, pass it maybe? Dialog expects allocationId mainly.
            // But wait, the dialog logic we fixed depends on allocationId being correct.
            // If we pass an array, the dialog doesn't handle array directly in 'data'. 
            // The StudentComponent logic selected the ID before passing.

            // Actually StudentComponent passed the array to its own method which THEN opened dialog.
            // Here we open dialog directly.
            // Let's rely on allocationId being the active one because we selected it in loadAllStudents.
        };

        this.dialog.open(PaymentHistoryDialogComponent, {
            width: '800px',
            data: dataForDialog
        });
    }

    exportData() {
        const dataToExport = this.selectedTab === 0
            ? this.upcomingPayments.map(p => ({
                StudentName: p.userName,
                Email: p.userEmail,
                BalanceDue: p.balance,
                DueDate: p.dueDate,
                IsOverdue: p.isOverdue ? 'Yes' : 'No',
                DaysRemaining: p.daysLeft
            }))
            : this.allStudents.map(s => ({
                StudentName: s.userName,
                Email: s.userEmail,
                Room: s.roomNumber,
                MonthlyRent: s.monthlyRent,
                TotalPaid: s.totalPaid
            }));

        const filename = this.selectedTab === 0 ? 'payment_dues_report' : 'all_students_payment_report';
        this.exportService.downloadCSV(dataToExport, filename);
    }
}
