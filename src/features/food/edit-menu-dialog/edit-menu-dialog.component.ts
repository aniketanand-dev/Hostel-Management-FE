import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../shared/materials/materials.module';
import { ApiService } from '../../../app/core/services/api.service';

@Component({
    selector: 'app-edit-menu-dialog',
    imports: [CommonModule, MaterialModule, ReactiveFormsModule],
    templateUrl: './edit-menu-dialog.component.html',
    styleUrl: './edit-menu-dialog.component.scss'
})
export class EditMenuDialogComponent implements OnInit {
    form: FormGroup;
    isLoading = false;

    constructor(
        private fb: FormBuilder,
        private api: ApiService,
        private dialogRef: MatDialogRef<EditMenuDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.form = this.fb.group({
            day: [data.day, Validators.required],
            breakfast: [data.breakfast || ''],
            lunch: [data.lunch || ''],
            snacks: [data.snacks || ''],
            dinner: [data.dinner || '']
        });
    }

    ngOnInit(): void { }

    onSubmit() {
        if (this.form.valid) {
            this.isLoading = true;
            this.api.postData('food', this.form.value).subscribe({
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
