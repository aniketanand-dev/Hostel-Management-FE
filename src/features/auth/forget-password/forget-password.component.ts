import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MaterialModule } from '../../../shared/materials/materials.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgOtpInputComponent } from "ng-otp-input";
import { AuthService } from '../auth-service/auth.service';
import { Router } from '@angular/router';
@Component({
    selector: 'app-forget-password',
    imports: [MaterialModule, NgOtpInputComponent],
    templateUrl: './forget-password.component.html',
    styleUrl: './forget-password.component.scss'
})

export class ForgetPasswordComponent implements OnInit, AfterViewInit {

    emailForm!: FormGroup;
    otpForm!: FormGroup;
    passwordForm!: FormGroup;

    showOtpForm = false;
    showPasswordForm = false;
    isLoading = false;

    otpInputValid = false;
    otpValue: string = '';

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.emailForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]]
        });

        this.passwordForm = this.fb.group({
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', [Validators.required]]
        }, { validators: this.passwordMatchValidator });
    }

    ngAfterViewInit(): void {
        this.otpForm = this.fb.group({
            otp: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    // Custom validator to match passwords
    passwordMatchValidator(form: FormGroup) {
        const password = form.get('password')?.value;
        const confirm = form.get('confirmPassword')?.value;
        return password === confirm ? null : { mismatch: true };
    }

    get email() { return this.emailForm.get('email'); }
    get otp() { return this.otpForm.get('otp'); }
    get password() { return this.passwordForm.get('password'); }
    get confirmPassword() { return this.passwordForm.get('confirmPassword'); }

    // Step 1: Email submission
    onEmailSubmit(): void {
        if (this.emailForm.valid) {
            this.isLoading = true;
            const payload = { email: this.emailForm.value.email };
            setTimeout(() => {
                this.isLoading = false;
                this.showOtpForm = true;

                // Call API to send OTP
                this.authService.forgetPassword(payload).subscribe(res => {
                    console.log('OTP sent:', res);
                });
            }, 1500);
        } else {
            this.emailForm.markAllAsTouched();
        }
    }

    // Step 2: OTP input
    onOtpInputChange(otpValue: string): void {
        this.otpInputValid = otpValue.length === 6;
        this.otpValue = otpValue;
    }

    onOtpSubmit(): void {
        if (!this.otpInputValid) {
            alert('Please enter a valid OTP.');
            return;
        }
        this.isLoading = true;
        const payload = { email: this.emailForm.value.email, otp: this.otpValue };
        setTimeout(() => {
            this.isLoading = false;
            this.authService.verifyOtp(payload).subscribe(res => {
                console.log('OTP verified:', res);
                if (res.success) {
                    // OTP verified → show password form
                    this.showPasswordForm = true;
                    this.showOtpForm = false;
                } else {
                    alert('Invalid OTP. Try again.');
                }
            });
        }, 1500);
    }

    // Step 3: Set new password
    onPasswordSubmit(): void {
        if (this.passwordForm.invalid) {
            this.passwordForm.markAllAsTouched();
            return;
        }
        this.isLoading = true;
        const payload = {
            email: this.emailForm.value.email,
            otp: this.otpValue,
            newPassword: this.passwordForm.value.password,
            confirmPassword: this.passwordForm.value.password
        };
        setTimeout(() => {
            this.isLoading = false;
            this.authService.resetPassword(payload).subscribe(res => {
                console.log('Password reset:', res);
                if (res.success) {
                    alert('Password reset successfully! You can now login.');
                    this.router.navigate(['/login']);
                } else {
                    alert('Failed to reset password. Try again.');
                }
            });
        }, 1500);
    }

}
