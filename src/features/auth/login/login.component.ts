import { Component, model } from '@angular/core';
import { MaterialModule } from '../../../shared/materials/materials.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../app/core/services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    imports: [MaterialModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    loginForm!: FormGroup;
    isLoading = false;
    hidePassword = true;
    errorMessage: string = '';
    successMessage: string = '';

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        if (this.authService.isLoggedIn()) {
            this.router.navigate(['home']);
            return;
        }
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    onSubmit(): void {
        if (this.loginForm.valid) {
            let payload: any = this.loginForm.value
            this.isLoading = true;
            this.errorMessage = '';
            this.successMessage = '';

            this.authService.login(payload).subscribe({
                next: (res) => {
                    this.authService.saveToken(res.data.token, res.data.user);
                    this.isLoading = false;
                    this.successMessage = 'Login successful! Redirecting...';
                    setTimeout(() => {
                        this.router.navigate(['home']);
                    }, 1500);
                },
                error: (err) => {
                    this.isLoading = false;
                    this.errorMessage = err.error?.message || 'Login failed. Please try again.';
                    console.error('Login error:', err);
                }
            });

        } else {
            this.loginForm.markAllAsTouched();
        }
    }

    get email() {
        return this.loginForm.get('email');
    }

    get password() {
        return this.loginForm.get('password');
    }
}