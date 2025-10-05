import { Routes } from '@angular/router';
import { StudentComponent } from './student.component';
import { StudentFormComponent } from './student-form/student-form.component';

export const studentRoutes: Routes = [
    {
        path: '',
        component: StudentComponent,
    },
    {
        path: "student-form",
        component: StudentFormComponent
    }
];
