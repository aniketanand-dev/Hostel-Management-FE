// core/services/toast.service.ts
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class ToastService {

    constructor(private snackBar: MatSnackBar) { }

    success(message: string) {
        this.snackBar.open(message, 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
        });
    }

    error(message: string) {
        this.snackBar.open(message, 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
        });
    }
}
