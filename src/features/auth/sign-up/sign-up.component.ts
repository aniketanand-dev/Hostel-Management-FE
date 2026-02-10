import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaterialModule } from '../../../shared/materials/materials.module';
import { AuthService } from '../../../app/core/services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-sign-up',
    imports: [MaterialModule],
    templateUrl: './sign-up.component.html',
    styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
    registerForm!: FormGroup;
    isLoading = false;
    hidePassword = true;
    hideConfirmPassword = true;
    errorMessage: string = '';
    successMessage: string = '';
    showOtpForm = false;
    otpValue: string = '';

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) { }

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
            this.errorMessage = '';
            
            const payload = {
                name: `${this.registerForm.value.firstName} ${this.registerForm.value.lastName}`,
                email: this.registerForm.value.email,
                password: this.registerForm.value.password,
                confirmPassword: this.registerForm.value.confirmPassword
            };

            // Call backend to register user
            this.authService.register(payload).subscribe({
                next: (res: any) => {
                    this.isLoading = false;
                    // Send OTP to email
                    this.sendOtpForVerification(payload.email);
                },
                error: (err: any) => {
                    this.isLoading = false;
                    this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
                    console.error('Registration error:', err);
                }
            });
        } else {
            this.registerForm.markAllAsTouched();
        }
    }

    sendOtpForVerification(email: string): void {
        this.authService.sendOtp(email).subscribe({
            next: (res: any) => {
                this.successMessage = 'Registration successful! OTP sent to your email.';
                this.showOtpForm = true;
            },
            error: (err: any) => {
                this.errorMessage = err.error?.message || 'Failed to send OTP.';
            }
        });
    }

    onOtpChange(event: any): void {
        this.otpValue = event.target.value;
    }

    verifyOtp(): void {
        if (!this.otpValue || this.otpValue.length !== 6) {
            this.errorMessage = 'Please enter a valid 6-digit OTP';
            return;
        }

        this.isLoading = true;
        const payload = {
            email: this.registerForm.value.email,
            otp: this.otpValue
        };

        this.authService.verifyOtp(payload).subscribe({
            next: (res: any) => {
                this.isLoading = false;
                this.successMessage = 'Email verified successfully! Redirecting to login...';
                setTimeout(() => {
                    this.router.navigate(['/auth/login']);
                }, 2000);
            },
            error: (err: any) => {
                this.isLoading = false;
                this.errorMessage = err.error?.message || 'OTP verification failed.';
            }
        });
    }

    // Getters for form controls for easier template access
    get firstName() { return this.registerForm.get('firstName'); }
    get lastName() { return this.registerForm.get('lastName'); }
    get email() { return this.registerForm.get('email'); }
    get password() { return this.registerForm.get('password'); }
    get confirmPassword() { return this.registerForm.get('confirmPassword'); }
}
