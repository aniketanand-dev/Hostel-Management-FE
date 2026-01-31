import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../../app/core/services/api.service';
import { MaterialModule } from '../../../shared/materials/materials.module';

@Component({
    selector: 'app-payment-history-dialog',
    imports: [CommonModule, MaterialModule],
    templateUrl: './payment-history-dialog.component.html',
    styleUrl: './payment-history-dialog.component.scss'
})
export class PaymentHistoryDialogComponent implements OnInit {
    payments: any[] = [];
    isLoading = true;

    displayedColumns: string[] = ['date', 'month', 'amount', 'status', 'receipt'];

    constructor(
        private api: ApiService,
        public dialogRef: MatDialogRef<PaymentHistoryDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    ngOnInit(): void {
        this.loadHistory();
    }

    loadHistory() {
        this.api.getData(`payment/history?allocationId=${this.data.allocationId}`).subscribe({
            next: (res: any) => {
                this.payments = res.data;
                this.isLoading = false;
            },
            error: (err) => {
                console.error(err);
                this.isLoading = false;
            }
        });
    }

    printReceipt(payment: any) {
        const printContent = `
      <html>
      <head>
        <title>Payment Receipt</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; }
          .receipt-box { border: 1px solid #ddd; padding: 30px; border-radius: 8px; max-width: 600px; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
          .header h1 { margin: 0; color: #2c3e50; font-size: 24px; }
          .header p { margin: 5px 0; color: #7f8c8d; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
          .info-item label { display: block; font-size: 12px; color: #95a5a6; text-transform: uppercase; letter-spacing: 1px; }
          .info-item span { font-weight: 600; font-size: 16px; }
          .amount-box { background: #f9f9f9; padding: 20px; text-align: center; border-radius: 6px; margin-bottom: 30px; }
          .amount-box h2 { margin: 0; font-size: 32px; color: #27ae60; }
          .footer { text-align: center; font-size: 12px; color: #bdc3c7; margin-top: 40px; }
          .status { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold; background: #e8f5e9; color: #2e7d32; }
        </style>
      </head>
      <body>
        <div class="receipt-box">
          <div class="header">
            <h1>PAYMENT RECEIPT</h1>
            <p>Receipt #${payment.id}</p>
            <p>${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="info-grid">
            <div class="info-item">
              <label>Student Name</label>
              <span>${this.data.userName}</span>
            </div>
            <div class="info-item">
              <label>Payment Date</label>
              <span>${new Date(payment.paymentDate).toLocaleDateString()}</span>
            </div>
            <div class="info-item">
              <label>For Period</label>
              <span>${this.getMonthName(payment.forMonth)} ${payment.forYear}</span>
            </div>
            <div class="info-item">
              <label>Status</label>
              <span class="status">${payment.status}</span>
            </div>
          </div>

          <div class="amount-box">
            <label style="display:block; margin-bottom:10px; color:#7f8c8d;">Amount Paid</label>
            <h2>₹${payment.amountPaid}</h2>
          </div>

          <div class="footer">
            <p>Thank you for your payment.</p>
            <p>This is a computer generated receipt.</p>
          </div>
        </div>
        <script>window.print();</script>
      </body>
      </html>
    `;

        const popupWin = window.open('', '_blank', 'width=800,height=600');
        if (popupWin) {
            popupWin.document.open();
            popupWin.document.write(printContent);
            popupWin.document.close();
        }
    }

    getMonthName(monthNum: number): string {
        const date = new Date();
        date.setMonth(monthNum - 1);
        return date.toLocaleString('default', { month: 'long' });
    }
}
