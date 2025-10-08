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
        MatSlideToggleModule],
    templateUrl: './student-form.component.html',
    styleUrl: './student-form.component.scss'
})
export class StudentFormComponent {
    studentForm!: FormGroup;

    constructor(
        private fb: FormBuilder,
        private userService: UserService

    ) {
        this.createForm();
    }

    createForm() {
        this.studentForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            gender: [''],
            isActive: [true]
        });
    }

    onSubmit() {
        if (this.studentForm.valid) {
            console.log('Student Data:', this.studentForm.value);
            const payload = this.studentForm.value
            payload.roleName = 'STUDENT'
            this.userService.createUser(payload).subscribe({
                next: (res) => {
                    console.log('✅ User created successfully:', res);
                },
                error: (err) => {
                    console.error('❌ Error creating user:', err);
                }
            });
        }
    }

}
