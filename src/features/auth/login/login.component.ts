import { Component, model } from '@angular/core';
import { MaterialModule } from '../../../shared/materials/materials.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../app/core/services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    imports: [ MaterialModule ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    loginForm!: FormGroup;
    isLoading = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    onSubmit(): void {
        if (this.loginForm.valid) {
            let payload: any = this.loginForm.value
            this.isLoading = true;
            //console.log(payload);
            this.authService.login(payload).subscribe({
                next: (res) => {
                    this.authService.saveToken(res.data.token);
                    this.isLoading = false;
                    console.log(res);
                    this.router.navigate(['dashboard'])
                }, error: (err) => {
                    console.log(err);

                }
            })

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