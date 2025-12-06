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
    {
        path: 'home',
        canActivate: [AuthGuard],
        loadComponent: () =>
            import('./../features/home/home.component').then(m => m.HomeComponent)
    },

    {
        path: '',
        loadComponent: () =>
            import('./../shared/components/layout-main/layout-main.component').then(m => m.LayoutMainComponent),
        canActivate: [AuthGuard],
        children: [
            {
                path: 'dashboard',
                loadComponent: () => //its use to load the compoenent directly
                    import('./../features/dashboard/dashboard.component').then(m => m.DashboardComponent)
            },
            {
                path: 'students',
                loadChildren: () => //its use to load child route
                    import('./../features/student/student.routes').then(m => m.studentRoutes)
            },
            //  {
            //    path: 'staffs',
            //    loadComponent: () =>
            //      import('./features/staff/staff-list.component').then(m => m.StaffListComponent)
            //  },
            //  {
            //    path: 'building',
            //    loadComponent: () =>
            //      import('./features/building/building-list.component').then(m => m.BuildingListComponent)
            //  },
            //  {
            //    path: 'reports',
            //    loadComponent: () =>
            //      import('./features/reports/report-list.component').then(m => m.ReportListComponent)
            //  }
        ]
    },

    // Wildcard
    { path: '**', redirectTo: 'auth/login' }
];
