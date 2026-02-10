import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../shared/materials/materials.module';
import { ApiService } from '../../../app/core/services/api.service';

@Component({
    selector: 'app-record-payment-dialog',
    imports: [CommonModule, MaterialModule, ReactiveFormsModule],
    templateUrl: './record-payment-dialog.component.html',
    styleUrl: './record-payment-dialog.component.scss'
})
export class RecordPaymentDialogComponent implements OnInit {
    paymentForm: FormGroup;
    isLoading = false;
    paymentType = 'monthly'; // 'monthly' or 'advance'
    months = [
        { value: 1, name: 'January' }, { value: 2, name: 'February' }, { value: 3, name: 'March' },
        { value: 4, name: 'April' }, { value: 5, name: 'May' }, { value: 6, name: 'June' },
        { value: 7, name: 'July' }, { value: 8, name: 'August' }, { value: 9, name: 'September' },
        { value: 10, name: 'October' }, { value: 11, name: 'November' }, { value: 12, name: 'December' }
    ];

    constructor(
        private fb: FormBuilder,
        private api: ApiService,
        private dialogRef: MatDialogRef<RecordPaymentDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        const today = new Date();
        this.paymentForm = this.fb.group({
            allocationId: [data.allocationId, Validators.required],
            amountPaid: [data.balance, [Validators.required, Validators.min(1)]],
            forMonth: [today.getMonth() + 1, Validators.required],
            forYear: [today.getFullYear(), Validators.required],
            notes: ['']
        });
    }

    ngOnInit(): void {
    }

    setPaymentType(type: 'monthly' | 'advance') {
        this.paymentType = type;
        if (type === 'advance') {
            this.paymentForm.patchValue({
                notes: 'Security/Advance Payment'
            });
        }
    }

    getMonthName(): string {
        const monthValue = this.paymentForm.get('forMonth')?.value;
        if (!monthValue) return '';
        const month = this.months.find(m => m.value === monthValue);
        return month ? month.name : '';
    }

    onSubmit() {
        if (this.paymentForm.valid) {
            this.isLoading = true;
            const payload = {
                ...this.paymentForm.value,
                paymentType: this.paymentType
            };
            this.api.postData('payment', payload).subscribe({
                next: (res) => {
                    this.isLoading = false;
                    this.dialogRef.close(true);
                },
                error: (err) => {
                    this.isLoading = false;
                    console.error(err);
                }
            });
        }
    }
}
