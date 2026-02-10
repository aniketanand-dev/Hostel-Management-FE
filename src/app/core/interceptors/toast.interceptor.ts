import { HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject, NgZone } from '@angular/core';
import { ToastService } from '../services/toast.service';
import { Router } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';

export function toastInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
    const toast = inject(ToastService);
    const router = inject(Router);
    const zone = inject(NgZone);

    return next(req).pipe(
        // Handle success responses
        tap(event => {
            if (event instanceof HttpResponse) {
                // Only show toast if backend returns a 'message'
                if (event.body && (event.body as any).message) {
                    zone.run(() => {
                        toast.success((event.body as any).message);
                    });
                }
            }
        }),
        // Handle errors
        catchError(error => {
            zone.run(() => {
                // Only show error toast if it's not a 401/403 (auth errors handled separately)
                if (error.status !== 401 && error.status !== 403) {
                    toast.error(error.error?.message || 'Something went wrong!');
                }
            });

            // Don't auto-redirect on 401 - let components handle it
            // This prevents infinite redirect loops
            
            return throwError(() => error);
        })
    );
}
