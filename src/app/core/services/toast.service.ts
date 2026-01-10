import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class ToastService {

    constructor(private snackBar: MatSnackBar) { }

    show(message: string, action: string = 'Close', duration: number = 3000, panelClass: string = '') {
        this.snackBar.open(message, action, {
            duration,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass
        });
    }

    success(message: string) {
        this.show(message, '✔️', 3000, 'success');
    }

    error(message: string) {
        this.show(message, '❌', 5000, 'error');
    }
}
