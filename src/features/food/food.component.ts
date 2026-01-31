import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/materials/materials.module';
import { ApiService } from '../../app/core/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { EditMenuDialogComponent } from './edit-menu-dialog/edit-menu-dialog.component';

@Component({
    selector: 'app-food',
    imports: [CommonModule, MaterialModule],
    templateUrl: './food.component.html',
    styleUrl: './food.component.scss'
})
export class FoodComponent implements OnInit {
    menu: any[] = [];
    isLoading = true;
    days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

    constructor(private api: ApiService, private dialog: MatDialog) { }

    ngOnInit(): void {
        this.loadMenu();
    }

    loadMenu() {
        this.isLoading = true;
        this.api.getData('food').subscribe({
            next: (res: any) => {
                this.menu = res.data;
                // Ensure all days exist locally even if backend has no record yet
                this.isLoading = false;
            },
            error: (err) => {
                console.error(err);
                this.isLoading = false;
            }
        });
    }

    getMenuForDay(day: string): any {
        return this.menu.find(m => m.day === day) || {};
    }

    editMenu(day: string) {
        const currentMenu = this.getMenuForDay(day);
        const dialogRef = this.dialog.open(EditMenuDialogComponent, {
            width: '500px',
            data: { day, ...currentMenu }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loadMenu();
            }
        });
    }
}
