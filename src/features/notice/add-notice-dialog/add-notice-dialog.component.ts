import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../shared/materials/materials.module';
import { ApiService } from '../../../app/core/services/api.service';

@Component({
    selector: 'app-add-notice-dialog',
    imports: [CommonModule, MaterialModule, ReactiveFormsModule],
    templateUrl: './add-notice-dialog.component.html',
    styleUrl: './add-notice-dialog.component.scss'
})
export class AddNoticeDialogComponent {
    form: FormGroup;
    isLoading = false;
    types = ['INFO', 'WARNING', 'EVENT', 'URGENT'];

    constructor(
        private fb: FormBuilder,
        private api: ApiService,
        private dialogRef: MatDialogRef<AddNoticeDialogComponent>
    ) {
        this.form = this.fb.group({
            title: ['', Validators.required],
            content: ['', Validators.required],
            type: ['INFO', Validators.required]
        });
    }

    onSubmit() {
        if (this.form.valid) {
            this.isLoading = true;
            this.api.postData('notice', this.form.value).subscribe({
                next: () => {
                    this.isLoading = false;
                    this.dialogRef.close(true);
                },
                error: (err) => {
                    console.error(err);
                    this.isLoading = false;
                }
            });
        }
    }
}
