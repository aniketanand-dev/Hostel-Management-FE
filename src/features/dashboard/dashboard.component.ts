import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../../app/core/services/api.service';
import { MaterialModule } from '../../shared/materials/materials.module';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { RouterLink, Router } from '@angular/router';
import { ExportService } from '../../app/core/services/export.service';

@Component({
    selector: 'app-dashboard',
    imports: [MaterialModule, CommonModule, MatListModule, RouterLink],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
    private api = inject(ApiService);
    private exportService = inject(ExportService);
    stats: any[] = [];
    allocationSummary: any[] = [];
    buildings: any[] = [];
    selectedBuildingId: number | null = null;
    upcomingPayments: any[] = [];
    studentsLeavingSoon: any[] = [];

    recentActivities = [
        { user: 'Admin', action: 'System statistics updated', time: 'Just now', icon: 'sync' },
        { user: 'Student', action: 'New registration pending', time: '10 mins ago', icon: 'person_add' }
    ];

    constructor() { }

    ngOnInit(): void {
        this.loadBuildings();
        this.loadUpcomingPayments();
    }

    loadUpcomingPayments(): void {
        this.api.getData('payment/upcoming').subscribe({
            next: (res: any) => {
                if (res.success) {
                    this.upcomingPayments = res.data;
                }
            },
            error: (err: any) => {
                console.error('Failed to load upcoming payments', err);
            }
        });
    }

    loadBuildings(): void {
        this.api.getData('building').subscribe({
            next: (res: any) => {
                if (res.success && res.data.length > 0) {
                    this.buildings = res.data;
                    this.selectedBuildingId = this.buildings[0].id;
                    this.loadAllocationStatus();
                    this.loadStats(this.selectedBuildingId);
                }
            },
            error: (err: any) => {
                console.error('Failed to load buildings', err);
            }
        });
    }

    loadStats(buildingId: number | null = null): void {
        let url = 'dashboard/stats';
        if (buildingId) {
            url += `?buildingId=${buildingId}`;
        }
        this.api.getData(url).subscribe({
            next: (res: any) => {
                if (res.success) {
                    const data = res.data;
                    this.stats = [
                        { label: 'Overall Students', value: data.overallTotalStudents?.toString() || data.totalStudents?.toString() || '0', icon: 'groups', color: '#6366f1', trend: 'Stable' },
                        { label: 'Building Students', value: data.totalStudents?.toString() || '0', icon: 'person', color: '#8b5cf6', trend: 'Building' },
                        { label: 'Occupied Beds', value: data.occupiedBeds?.toString() || '0', icon: 'bed', color: '#10b981', trend: `${data.totalBeds > 0 ? Math.round((data.occupiedBeds / data.totalBeds) * 100) : 0}%` },
                        { label: 'Maintenance', value: data.maintenanceBeds?.toString() || '0', icon: 'construction', color: '#f59e0b', trend: 'Service' },
                        { label: 'Available Beds', value: data.availableBeds?.toString() || '0', icon: 'door_front', color: '#ec4899', trend: 'Ready' }
                    ];
                    this.studentsLeavingSoon = data.studentsLeavingSoon || [];
                }
            },
            error: (err: any) => {
                console.error('Failed to load stats', err);
            }
        });
    }

    loadAllocationStatus(): void {
        if (!this.selectedBuildingId) return;

        this.api.getData(`dashboard/allocation-status?buildingId=${this.selectedBuildingId}`).subscribe({
            next: (res: any) => {
                if (res.success) {
                    this.allocationSummary = res.data.map((floor: any) => {
                        let totalBeds = 0;
                        let occupiedBeds = 0;
                        floor.rooms.forEach((room: any) => {
                            totalBeds += (room.beds ? room.beds.length : 0);
                            occupiedBeds += (room.beds ? room.beds.filter((b: any) => b.status === 'OCCUPIED').length : 0);
                        });
                        return {
                            floorNumber: floor.floorNumber,
                            totalBeds,
                            occupiedBeds,
                            percentage: totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0
                        };
                    });
                }
            },
            error: (err: any) => {
                console.error('Failed to load allocation status', err);
            }
        });
    }

    private router = inject(Router);

    onBuildingChange(event: any): void {
        this.selectedBuildingId = event.value;
        this.loadAllocationStatus();
        this.loadStats(this.selectedBuildingId);
    }

    viewRoom(item: any): void {
        if (item.floorId && item.buildingId) {
            this.router.navigate(['/buildings/room'], {
                queryParams: { floorId: item.floorId, buildingId: item.buildingId }
            });
        }
    }

    exportReport() {
        if (this.stats.length === 0) return;

        const data = this.stats.map(s => ({
            Metric: s.label,
            Value: s.value,
            Trend: s.trend
        }));

        this.exportService.downloadCSV(data, 'dashboard_summary');
    }
}
