import { Routes } from '@angular/router';
import { BuildingComponent } from './building.component';
import { BuildingFormComponent } from './building-form/building-form.component';

export const buildingRoutes: Routes = [
    {
        path: '',
        component: BuildingComponent
    },
    {
        path: 'building-form',
        component: BuildingFormComponent
    }
];
