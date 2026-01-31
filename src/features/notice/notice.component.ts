import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/materials/materials.module';
import { ApiService } from '../../app/core/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { AddNoticeDialogComponent } from './add-notice-dialog/add-notice-dialog.component';

@Component({
    selector: 'app-notice',
    imports: [CommonModule, MaterialModule],
    templateUrl: './notice.component.html',
    styleUrl: './notice.component.scss'
})
export class NoticeComponent implements OnInit {
    notices: any[] = [];
    isLoading = true;

    constructor(private api: ApiService, private dialog: MatDialog) { }

    ngOnInit(): void {
        this.loadNotices();
    }

    loadNotices() {
        this.isLoading = true;
        this.api.getData('notice').subscribe({
            next: (res: any) => {
                this.notices = res.data;
                this.isLoading = false;
            },
            error: (err) => {
                console.error(err);
                this.isLoading = false;
            }
        });
    }

    addNotice() {
        const dialogRef = this.dialog.open(AddNoticeDialogComponent, {
            width: '500px'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loadNotices();
            }
        });
    }

    deleteNotice(id: number) {
        if (confirm('Delete this notice?')) {
            this.api.deleteData('notice', id).subscribe(() => this.loadNotices());
        }
    }

    getTypeColor(type: string): string {
        switch (type) {
            case 'URGENT': return 'warn';
            case 'WARNING': return 'accent';
            case 'EVENT': return 'primary';
            default: return '';
        }
    }
}
