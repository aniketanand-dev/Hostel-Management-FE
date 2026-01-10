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
                toast.error(error.error?.message || 'Something went wrong!');
            });

            if (error.status === 401) {
                zone.run(() => router.navigate(['/login']));
            }

            return throwError(() => error);
        })
    );
}
