import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../app/core/services/api.service';
import { MaterialModule } from '../../shared/materials/materials.module';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-floor',
    standalone: true,
    imports: [CommonModule, FormsModule, MaterialModule],
    templateUrl: './floor.component.html',
    styleUrl: './floor.component.scss'
})
export class FloorComponent implements OnInit {

    floors: any[] = [];
    showAddFloorPopup = false;
    showEditFloorModal = false;
    newFloorNumber: number | null = null;
    isSubmitting = false;

    editFloorData: any = {
        id: null,
        floorNumber: null
    };

    // URL param
    selectedBuildingId: number | null = null;
    buildingName: string = '';

    constructor(
        private apiService: ApiService,
        private router: Router,
        private route: ActivatedRoute,
        private snackBar: MatSnackBar,
        private location: Location
    ) { }

    goBack(): void {
        this.location.back();
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe((params: any) => {
            this.selectedBuildingId = +params['buildingId'] || null;
            if (this.selectedBuildingId) {
                this.loadFloors();
            }
        });
    }

    // 🔹 GET floors
    loadFloors(): void {
        if (!this.selectedBuildingId) return;

        this.apiService.getData(`floor?buildingId=${this.selectedBuildingId}`).subscribe({
            next: (res: any[]) => {
                if (res.length > 0) {
                    this.buildingName = res[0].building?.buildingName || 'Building';
                } else {
                    // if no floors, we might still want the building name, but for now just clear
                    this.buildingName = 'Building';
                }
                this.floors = res.map(f => ({
                    id: f.id,
                    floorNumber: f.floorNumber,
                    roomCount: f.rooms ? f.rooms.length : 0,
                    occupiedBedsCount: f.occupiedBedsCount || 0
                }));
            },
            error: (err: any) => {
                console.error('Failed to load floors', err);
            }
        });
    }

    openEditFloor(row: any): void {
        this.editFloorData = {
            id: row.id,
            floorNumber: row.floorNumber
        };
        this.showEditFloorModal = true;
    }

    closeEditFloor(): void {
        this.showEditFloorModal = false;
        this.editFloorData = { id: null, floorNumber: null };
    }

    updateFloor(): void {
        if (!this.editFloorData.floorNumber || isNaN(+this.editFloorData.floorNumber)) {
            this.snackBar.open('Valid floor number is required', 'Close', { duration: 3000 });
            return;
        }

        this.isSubmitting = true;
        this.apiService.putData(`floor/${this.editFloorData.id}`, { floorNumber: +this.editFloorData.floorNumber }).subscribe({
            next: () => {
                this.snackBar.open('Floor updated successfully', 'Close', { duration: 3000 });
                this.isSubmitting = false;
                this.closeEditFloor();
                this.loadFloors();
            },
            error: (err: any) => {
                this.snackBar.open(err.error?.message || 'Failed to update floor', 'Close', { duration: 3000 });
                this.isSubmitting = false;
            }
        });
    }

    deleteFloor(row: any): void {
        if (row.occupiedBedsCount > 0) {
            this.snackBar.open('Cannot delete floor with occupied beds', 'Close', { duration: 3000 });
            return;
        }

        if (confirm(`Are you sure you want to delete Floor ${row.floorNumber}? All rooms on this floor will be affected.`)) {
            this.apiService.deleteData(`floor/${row.id}`).subscribe({
                next: () => {
                    this.snackBar.open('Floor deleted successfully', 'Close', { duration: 3000 });
                    this.loadFloors();
                },
                error: (err: any) => {
                    this.snackBar.open(err.error?.message || 'Failed to delete floor', 'Close', { duration: 3000 });
                }
            });
        }
    }

    goToRooms(row: any): void {
        this.router.navigate(
            ['/buildings/room'],
            {
                queryParams: {
                    buildingId: this.selectedBuildingId,
                    floorId: row.id
                }
            }
        );
    }

    openAddFloorPopup(): void {
        this.showAddFloorPopup = true;
    }

    closeAddFloorPopup(): void {
        this.showAddFloorPopup = false;
        this.newFloorNumber = null;
    }

    // 🔹 POST floor
    addFloor(): void {
        if (!this.newFloorNumber || this.newFloorNumber <= 0) {
            this.snackBar.open('Floor number must be a positive integer', 'Close', { duration: 3000 });
            return;
        }

        this.isSubmitting = true;
        const payload = {
            buildingId: this.selectedBuildingId,
            floorNumber: Number(this.newFloorNumber)
        };

        this.apiService.postData('floor', payload).subscribe({
            next: () => {
                this.snackBar.open('Floors added successfully', 'Close', { duration: 3000 });
                this.closeAddFloorPopup();
                this.loadFloors();
                this.isSubmitting = false;
            },
            error: (err: any) => {
                this.snackBar.open(err.error?.message || 'Failed to add floors', 'Close', { duration: 3000 });
                this.isSubmitting = false;
            }
        });
    }
}
