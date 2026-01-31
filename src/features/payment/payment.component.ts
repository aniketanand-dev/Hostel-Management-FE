import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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

    upcomingPayments: any[] = [];
    isLoading = false;
    displayedColumns: string[] = ['name', 'amount', 'dueDate', 'daysLeft', 'status', 'action'];

    ngOnInit(): void {
        this.loadUpcomingPayments();
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

    recordPayment(element: any) {
        const dialogRef = this.dialog.open(RecordPaymentDialogComponent, {
            width: '500px',
            data: element
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loadUpcomingPayments();
            }
        });
    }

    viewHistory(element: any) {
        this.dialog.open(PaymentHistoryDialogComponent, {
            width: '600px',
            data: element
        });
    }

    exportData() {
        if (this.upcomingPayments.length === 0) return;

        // Format data for export
        const dataToExport = this.upcomingPayments.map(p => ({
            StudentName: p.userName,
            Email: p.userEmail,
            BalanceDue: p.balance,
            DueDate: p.dueDate,
            IsOverdue: p.isOverdue ? 'Yes' : 'No',
            DaysRemaining: p.daysLeft
        }));

        this.exportService.downloadCSV(dataToExport, 'payment_dues_report');
    }
}
