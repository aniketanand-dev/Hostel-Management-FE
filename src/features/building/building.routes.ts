import { Routes } from '@angular/router';
import { BuildingComponent } from './building.component';
import { BuildingFormComponent } from './building-form/building-form.component';
import { FloorComponent } from '../floor/floor.component';
import { RoomComponent } from '../room/room.component';

export const buildingRoutes: Routes = [
    {
        path: '',
        component: BuildingComponent
    },
    {
        path: 'building-form',
        component: BuildingFormComponent
    },
    {
        path: 'floors',
        component: FloorComponent
    },
    {
        path: 'room',
        component: RoomComponent
    }
];
