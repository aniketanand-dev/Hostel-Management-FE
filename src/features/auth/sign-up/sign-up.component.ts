import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaterialModule } from '../../../shared/materials/materials.module';

@Component({
    selector: 'app-sign-up',
    imports: [MaterialModule],
    templateUrl: './sign-up.component.html',
    styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
    registerForm!: FormGroup;
    isLoading = false;

    constructor(private fb: FormBuilder) { }

    ngOnInit(): void {
        this.registerForm = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required]
        }, { validators: this.passwordMatchValidator });
    }

    passwordMatchValidator(form: FormGroup) {
        const password = form.get('password')?.value;
        const confirmPassword = form.get('confirmPassword')?.value;
        if (password !== confirmPassword) {
            return { mismatch: true };
        }
        return null;
    }

    onSubmit(): void {
        if (this.registerForm.valid) {
            this.isLoading = true;
            // In a real app, call a registration service
            console.log('Registration submitted:', this.registerForm.value);
            setTimeout(() => {
                this.isLoading = false;
                alert('Registration successful! Please check your email for verification.');
                // Navigate to login or email verification page
            }, 1500);
        } else {
            this.registerForm.markAllAsTouched();
        }
    }

    // Getters for form controls for easier template access
    get firstName() { return this.registerForm.get('firstName'); }
    get lastName() { return this.registerForm.get('lastName'); }
    get email() { return this.registerForm.get('email'); }
    get password() { return this.registerForm.get('password'); }
    get confirmPassword() { return this.registerForm.get('confirmPassword'); }
}
