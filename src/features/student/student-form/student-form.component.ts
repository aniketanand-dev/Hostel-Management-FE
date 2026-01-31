import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../app/core/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
    selector: 'app-student-form',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatDividerModule,
        MatSnackBarModule,
        MatSlideToggleModule],
    templateUrl: './student-form.component.html',
    styleUrl: './student-form.component.scss'
})
export class StudentFormComponent {
    studentForm!: FormGroup;
    roleName: 'STAFF' | 'STUDENT' = 'STUDENT';
    studentId: number | null = null;
    isEditMode = false;

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private route: ActivatedRoute,
        private router: Router,
        private snackBar: MatSnackBar
    ) {
        this.createForm();
        this.readQueryParams();
    }

    createForm() {
        this.studentForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            gender: [''],
            isActive: [true]
        });
    }

    readQueryParams() {
        this.route.queryParams.subscribe((params: any) => {
            if (params['type'] === 'staff') {
                this.roleName = 'STAFF';
            } else {
                this.roleName = 'STUDENT';
            }

            if (params['id']) {
                this.studentId = +params['id'];
                this.isEditMode = true;
                this.loadUserData(this.studentId.toString());
            }
        });
    }

    loadUserData(id: string) {
        const obs = this.roleName === 'STUDENT'
            ? this.userService.getStudentById(id)
            : this.userService.getStudentById(id); // assuming we can use same or similar for staff

        obs.subscribe({
            next: (res: any) => {
                if (res.success) {
                    this.studentForm.patchValue({
                        name: res.data.name,
                        email: res.data.email,
                        gender: res.data.gender || '',
                        isActive: res.data.isActive !== undefined ? res.data.isActive : true
                    });
                }
            }
        });
    }

    onSubmit() {
        if (this.studentForm.valid) {
            const payload = {
                ...this.studentForm.value,
                roleName: this.roleName
            };

            const obs = this.isEditMode && this.studentId
                ? this.userService.updateUser(this.studentId, payload)
                : this.userService.createUser(payload);

            obs.subscribe({
                next: (res) => {
                    this.snackBar.open(`${this.roleName} ${this.isEditMode ? 'updated' : 'created'} successfully`, 'Close', {
                        duration: 3000,
                        panelClass: ['success-snackbar']
                    });
                    this.router.navigate([this.roleName === 'STUDENT' ? '/students' : '/staffs']);
                },
                error: (err) => {
                    this.snackBar.open(err.error?.message || `Error ${this.isEditMode ? 'updating' : 'creating'} user`, 'Close', {
                        duration: 3000
                    });
                }
            });
        }
    }
}

