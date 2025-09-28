import { Component } from '@angular/core';
import { MaterialModule } from '../../../shared/materials/materials.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgOtpInputComponent } from "ng-otp-input";

@Component({
    selector: 'app-forget-password',
    imports: [MaterialModule, NgOtpInputComponent],
    templateUrl: './forget-password.component.html',
    styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponent {
    emailForm!: FormGroup;
    showOtpForm = false;
    isLoading = false;
    allow: any;
    otpForm!: FormGroup;

    constructor(private fb: FormBuilder) { }

    ngOnInit(): void {
        this.emailForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    onEmailSubmit(): void {
        if (this.emailForm.valid) {
            this.isLoading = true;
            // In a real app, this would call a service to send a reset email/OTP
            console.log('Password reset requested for email:', this.emailForm.value.email);
            setTimeout(() => {
                this.isLoading = false;
                this.showOtpForm = true; // Show the OTP form after successful email submission
                alert('Password reset instructions sent to your email. Please check your inbox.');
            }, 1500);
        } else {
            this.emailForm.markAllAsTouched();
        }
    }



    ngAfterViewInit(): void { // Initialize OTP form after view is ready
        this.otpForm = this.fb.group({
            otp: ['', [Validators.required, Validators.minLength(6)]] // Assuming 6-digit OTP
        });
    }

    get email() { return this.emailForm.get('email'); }
    get otp() { return this.otpForm.get('otp'); }

    otpInputValid = false; // To track if the OTP input is valid (e.g., has enough digits)

    onOtpInputChange(otpValue: string): void {
        // The ng-otp-input component often handles its own validation internally
        // You might check if the input has the required number of digits
        this.otpInputValid = otpValue.length === 6; // Assuming 6 digits
        // You can also set a FormControl value if using reactive forms with ng-otp-input
        // this.otpForm.get('otp')?.setValue(otpValue);
    }

    onOtpSubmit(): void {
        if (!this.otpInputValid) {
            alert('Please enter a valid OTP.');
            return;
        }
        this.isLoading = true;
        // Call service to verify OTP
        console.log('OTP submitted:', /* get OTP value from your input mechanism */);
        setTimeout(() => {
            this.isLoading = false;
            alert('OTP verified successfully! Proceed to reset password.');
            // Navigate to password reset page
        }, 1500);
    }

}
