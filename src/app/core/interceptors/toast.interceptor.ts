// core/interceptors/error.interceptor.ts
import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastService } from '../services/toast.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export function errorInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
    const toast = inject(ToastService);
    const router = inject(Router);

    return next(req).pipe(
        catchError(error => {
            toast.error(error.error?.message || 'Something went wrong!');

            if (error.status === 401) {
                router.navigate(['/login']);
            }

            return throwError(() => error);
        })
    );
}
