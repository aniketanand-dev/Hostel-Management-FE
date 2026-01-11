import { Component, OnInit } from '@angular/core';

import { MaterialModule } from '../../shared/materials/materials.module';
import { OnBoardingService } from '../../app/core/services/on-boarding.service';

@Component({
    selector: 'app-building',
    imports: [MaterialModule],
    templateUrl: './building.component.html',
    styleUrl: './building.component.scss'
})
export class BuildingComponent implements OnInit {
    displayedColumns: string[] = ['id', 'buildingName', 'action'];
    dataSource: any[] = [];

    constructor(
        private _onBoardingService: OnBoardingService
    ) { }


    ngOnInit(): void {
        this._onBoardingService.getBuilding().subscribe(res => {
            console.log(res);

            this.dataSource = res.data
        });
    }

    editStudent(row: any) {
        console.log('Edit', row);
    }

    viewStudent(row: any) {
        console.log('View', row);
    }

    deleteStudent(row: any) {
        console.log('Delete', row);
    }
}
