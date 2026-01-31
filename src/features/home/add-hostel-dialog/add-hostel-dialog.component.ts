import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MaterialModule } from '../../../shared/materials/materials.module';
import { ApiService } from '../../../app/core/services/api.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-add-hostel-dialog',
    imports: [MaterialModule, ReactiveFormsModule, CommonModule, MatDialogModule],
    templateUrl: './add-hostel-dialog.component.html',
    styleUrl: './add-hostel-dialog.component.scss'
})
export class AddHostelDialogComponent {
    hostelForm: FormGroup;
    isLoading = false;

    constructor(
        private fb: FormBuilder,
        private _api: ApiService,
        private dialogRef: MatDialogRef<AddHostelDialogComponent>
    ) {
        this.hostelForm = this.fb.group({
            hostelName: ['', Validators.required],
            location: ['', Validators.required],
            capacity: [100, [Validators.required, Validators.min(1)]]
        });
    }

    onSubmit() {
        if (this.hostelForm.valid) {
            this.isLoading = true;
            this._api.postData('hostel/add', this.hostelForm.value).subscribe({
                next: (res) => {
                    this.isLoading = false;
                    this.dialogRef.close(true); // Close with success signal
                },
                error: (err) => {
                    this.isLoading = false;
                    console.error(err);
                }
            });
        }
    }
}
