import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

    // Auth (eager load small components)
    {
        path: 'auth/login',
        loadComponent: () =>
            import('./../features/auth/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'auth/register',
        loadComponent: () =>
            import('./../features/auth/sign-up/sign-up.component').then(m => m.SignUpComponent)
    },
    {
        path: 'auth/forgot-password',
        loadComponent: () =>
            import('./../features/auth/forget-password/forget-password.component').then(m => m.ForgetPasswordComponent)
    },
    //{
    //    path: 'auth/otp',
    //    loadComponent: () =>
    //        import('../../features/auth/otp-verification.component').then(m => m.OTPVerificationComponent)
    //},

    // Dashboard
    {
        path: 'dashboard',
        loadComponent: () =>
            import('./../features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [AuthGuard]
    },
    //// Student
    //{
    //    path: 'students',
    //    loadComponent: () =>
    //        import('../../features/student/student-list.component').then(m => m.StudentListComponent),
    //    //canActivate: [AuthGuard]
    //},

    //// Staff
    //{
    //    path: 'staffs',
    //    loadComponent: () =>
    //        import('../../features/staff/staff-list.component').then(m => m.StaffListComponent),
    //    //canActivate: [AuthGuard]
    //},

    //// Building
    //{
    //    path: 'building',
    //    loadComponent: () =>
    //        import('../../features/building/building-list.component').then(m => m.BuildingListComponent),
    //    //canActivate: [AuthGuard]
    //},

    //// Reports
    //{
    //    path: 'reports',
    //    loadComponent: () =>
    //        import('../../features/reports/report-list.component').then(m => m.ReportListComponent),
    //    //canActivate: [AuthGuard]
    //},

    // Wildcard
    { path: '**', redirectTo: 'auth/login' }
];
