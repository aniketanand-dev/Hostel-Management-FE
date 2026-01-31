import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/materials/materials.module';
import { ApiService } from '../../app/core/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { AddComplaintDialogComponent } from './add-complaint-dialog/add-complaint-dialog.component';

@Component({
    selector: 'app-complaint',
    imports: [CommonModule, MaterialModule],
    templateUrl: './complaint.component.html',
    styleUrl: './complaint.component.scss'
})
export class ComplaintComponent implements OnInit {
    complaints: any[] = [];
    isLoading = true;
    filterStatus = '';

    constructor(private api: ApiService, private dialog: MatDialog) { }

    ngOnInit(): void {
        this.loadComplaints();
    }

    loadComplaints() {
        this.isLoading = true;
        let url = 'complaint?my=true'; // Default show my complaints? Or logic can depend on role
        // For now, let's fetch all relevant to the user/hostel.
        // Ideally we check role, but API handles 'my' or 'all' if admin.
        // Let's assume we want to see ALL for admin, MY for student.
        // We can handle this logic in component if we knew role. 
        // For now, let's fetch 'all' for the hostel and let backend filter if needed.
        // Actually, backend filters by hostelId by default.
        // If I pass nothing, I get all in hostel.

        this.api.getData('complaint').subscribe({
            next: (res: any) => {
                this.complaints = res.data;
                this.isLoading = false;
            },
            error: (err) => {
                console.error(err);
                this.isLoading = false;
            }
        });
    }

    openAddDialog() {
        const dialogRef = this.dialog.open(AddComplaintDialogComponent, {
            width: '600px'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loadComplaints();
            }
        });
    }

    getPriorityColor(priority: string): string {
        switch (priority) {
            case 'CRITICAL': return 'warn';
            case 'HIGH': return 'accent';
            case 'MEDIUM': return 'primary';
            default: return '';
        }
    }

    getStatusClass(status: string): string {
        return status.toLowerCase().replace('_', '-');
    }

    resolveComplaint(item: any) {
        if (confirm('Mark this complaint as resolved?')) {
            const payload = { status: 'RESOLVED' };
            this.api.patchData(`complaint/${item.id}/status`, payload).subscribe({
                next: () => {
                    this.loadComplaints();
                }
            });
        }
    }

    deleteComplaint(item: any) {
        if (confirm('Are you sure you want to delete this complaint?')) {
            this.api.deleteData(`complaint/${item.id}`).subscribe({
                next: () => {
                    this.loadComplaints();
                }
            });
        }
    }

    replyComplaint(item: any) {
        const comment = prompt('Enter your reply/comment:', item.adminComment || '');
        if (comment !== null) {
            const payload = { adminComment: comment, status: 'IN_PROGRESS' };
            this.api.patchData(`complaint/${item.id}/status`, payload).subscribe({
                next: () => {
                    this.loadComplaints();
                }
            });
        }
    }

    getEscalationLabel(level: number): string {
        switch (level) {
            case 1: return 'Escalated to Manager';
            case 2: return 'Escalated to Owner';
            default: return 'Staff Level';
        }
    }
}
