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

    displayedColumns: string[] = ['date', 'month', 'amount', 'status', 'receipt', 'actions'];

    constructor(
        private api: ApiService,
        public dialogRef: MatDialogRef<PaymentHistoryDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    ngOnInit(): void {
        this.loadHistory();
    }

    loadHistory() {
        console.log('Loading history for allocationId:', this.data.allocationId);
        this.api.getData(`payment/history?allocationId=${this.data.allocationId}`).subscribe({
            next: (res: any) => {
                console.log('Payment history loaded:', res);
                this.payments = res.data;
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading history:', err);
                this.isLoading = false;
            }
        });
    }

    cancelPayment(id: number) {
        if (confirm('Are you sure you want to cancel this payment? This will record the cancellation for audit purposes.')) {
            this.isLoading = true;
            this.api.deleteData(`payment/${id}`).subscribe({
                next: (res) => {
                    this.loadHistory();
                },
                error: (err) => {
                    this.isLoading = false;
                    alert(err.error?.message || 'Error cancelling payment');
                    console.error(err);
                }
            });
        }
    }

    isLatestPayment(payment: any): boolean {
        const activePayments = this.payments.filter(p => p.status !== 'CANCELLED');
        if (activePayments.length === 0) return false;
        return activePayments[0].id === payment.id;
    }

    canShowRefund(payment: any): boolean {
        if (payment.status === 'CANCELLED' || payment.status === 'REFUNDED') return false;
        const refundAmt = parseFloat(payment.refundAmount || '0');
        return refundAmt <= 0;
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

    getExtraAmount(payment: any): number {
        const paid = parseFloat(payment.amountPaid);
        const total = parseFloat(payment.totalAmount);
        if (paid > total) {
            return paid - total;
        }
        return 0;
    }

    openRefundDialog(payment: any): void {
        const maxRefund = parseFloat(payment.amountPaid);
        const extraPaid = this.getExtraAmount(payment);
        const defaultRefund = extraPaid > 0 ? extraPaid : '';

        const refundAmount = prompt(`Enter refund amount (Max: ₹${maxRefund}):`, defaultRefund.toString());

        if (refundAmount === null) return; // User cancelled

        const refundAmountNum = parseFloat(refundAmount);

        if (isNaN(refundAmountNum) || refundAmountNum <= 0 || refundAmountNum > maxRefund) {
            alert('Invalid refund amount. Please enter a value between 0 and ' + maxRefund);
            return;
        }

        const refundNotes = prompt('Reason for refund (optional):') || 'Overpayment refund';

        if (confirm(`Issue refund of ₹${refundAmountNum} to ${this.data.userName}?`)) {
            this.isLoading = true;
            this.api.postData(`payment/${payment.id}/refund`, {
                refundAmount: refundAmountNum,
                refundNotes: refundNotes
            }).subscribe({
                next: (res: any) => {
                    alert(`Refund of ₹${refundAmountNum} recorded successfully. Please return the cash to the student.`);
                    this.loadHistory();
                },
                error: (err) => {
                    this.isLoading = false;
                    alert(err.error?.message || 'Error processing refund');
                    console.error(err);
                }
            });
        }
    }
}
