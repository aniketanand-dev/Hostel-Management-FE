import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../shared/materials/materials.module';
import { ApiService } from '../../../app/core/services/api.service';

@Component({
    selector: 'app-add-complaint-dialog',
    imports: [CommonModule, MaterialModule, ReactiveFormsModule],
    templateUrl: './add-complaint-dialog.component.html',
    styleUrl: './add-complaint-dialog.component.scss'
})
export class AddComplaintDialogComponent implements OnInit {
    form: FormGroup;
    isLoading = false;

    types = ['MAINTENANCE', 'FOOD', 'CLEANING', 'DISCIPLINE', 'OTHER'];
    priorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

    constructor(
        private fb: FormBuilder,
        private api: ApiService,
        private dialogRef: MatDialogRef<AddComplaintDialogComponent>
    ) {
        this.form = this.fb.group({
            title: ['', Validators.required],
            description: ['', Validators.required],
            type: ['MAINTENANCE', Validators.required],
            priority: ['MEDIUM', Validators.required]
        });
    }

    ngOnInit(): void { }

    onSubmit() {
        if (this.form.valid) {
            this.isLoading = true;
            this.api.postData('complaint', this.form.value).subscribe({
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
