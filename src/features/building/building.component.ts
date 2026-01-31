import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../shared/materials/materials.module';
import { OnBoardingService } from '../../app/core/services/on-boarding.service';
import { Router, RouterModule } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';

import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-building',
    imports: [MaterialModule, CommonModule, RouterModule],
    templateUrl: './building.component.html',
    styleUrl: './building.component.scss'
})
export class BuildingComponent implements OnInit {
    displayedColumns: string[] = ['id', 'buildingName', 'action'];
    dataSource = new MatTableDataSource<any>([]);

    constructor(
        private _onBoardingService: OnBoardingService,
        private _router: Router,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this._onBoardingService.getBuilding().subscribe(res => {
            this.dataSource.data = res.data;
        });
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    editBuilding(row: any) {
        this._router.navigate(['/buildings/building-form'], {
            queryParams: {
                type: 'building',
                id: row.id,
                name: row.buildingName
            }
        });
    }

    viewBuilding(row: any) {
        this._router.navigate(['/buildings/floors'], {
            queryParams: { buildingId: row.id }
        });
    }

    deleteBuilding(row: any) {
        if (confirm(`Are you sure you want to delete ${row.buildingName}?`)) {
            this._onBoardingService.deleteBuilding(row.id).subscribe({
                next: () => {
                    this.dataSource.data = this.dataSource.data.filter(b => b.id !== row.id);
                    this.snackBar.open('Building deleted successfully', 'Close', { duration: 3000 });
                },
                error: (err) => {
                    this.snackBar.open('Failed to delete building', 'Close', { duration: 3000 });
                }
            });
        }
    }
}
