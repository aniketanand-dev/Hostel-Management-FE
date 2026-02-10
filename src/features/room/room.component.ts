import { Component, OnInit, inject, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../app/core/services/api.service';
import { MaterialModule } from '../../shared/materials/materials.module';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-room',
    standalone: true,
    imports: [CommonModule, MaterialModule, FormsModule],
    templateUrl: './room.component.html',
    styleUrl: './room.component.scss'
})
export class RoomComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private api = inject(ApiService);
    private dialog = inject(MatDialog);
    private snackBar = inject(MatSnackBar);
    private platformId = inject(PLATFORM_ID);

    floorId: number | null = null;
    buildingId: number | null = null;
    rooms: any[] = [];
    isLoading = false;

    // Room creation
    showAddRoomModal = false;
    newRoom = {
        roomNumber: '',
        type: 'SINGLE',
        basePrice: 0
    };

    // Room editing
    showEditRoomModal = false;
    editRoomData = {
        id: null,
        roomNumber: '',
        type: '',
        basePrice: 0,
        status: ''
    };

    // Allocation
    showAllocationModal = false;
    selectedBed: any = null;
    selectedRoom: any = null;
    allocationData = {
        userId: '',
        startDate: new Date().toISOString().split('T')[0],
        allocationType: 'REGULAR'
    };
    students: any[] = [];

    // Payment
    showPaymentModal = false;
    paymentData = {
        amountPaid: 0,
        forMonth: new Date().getMonth() + 1,
        forYear: new Date().getFullYear(),
        notes: ''
    };

    // Transfer
    showTransferModal = false;
    transferData: any = {
        allocationId: null,
        newBedId: null,
        transferDate: new Date().toISOString().split('T')[0]
    };
    availableBeds: any[] = [];

    // Notice & Departure
    showNoticeModal = false;
    noticeData: any = {
        allocationId: null,
        plannedDate: new Date().toISOString().split('T')[0],
        dailyCharge: null
    };
    checkoutSummary: any = null;

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.route.queryParams.subscribe(params => {
                this.floorId = +params['floorId'];
                this.buildingId = +params['buildingId'];
                if (this.floorId) {
                    this.loadRooms();
                }
            });
            this.loadStudents();
        }
    }

    // Bed editing
    showEditBedModal = false;
    editBedData = {
        id: null,
        bedNumber: '',
        status: ''
    };

    editBed(bed: any): void {
        this.editBedData = {
            id: bed.id,
            bedNumber: bed.bedNumber,
            status: bed.status
        };
        this.showEditBedModal = true;
    }

    closeEditBedModal(): void {
        this.showEditBedModal = false;
        this.editBedData = { id: null, bedNumber: '', status: '' };
    }

    updateBed(): void {
        if (!this.editBedData.bedNumber) return;

        this.api.putData(`bed/${this.editBedData.id}`, this.editBedData).subscribe({
            next: () => {
                this.snackBar.open('Bed updated successfully', 'Close', { duration: 3000 });
                this.closeEditBedModal();
                this.loadRooms();
            },
            error: (err: any) => {
                this.snackBar.open(err.error?.message || 'Error updating bed', 'Close', { duration: 3000 });
            }
        });
    }

    confirmDeleteBed(bed: any): void {
        if (confirm(`Are you sure you want to delete Bed ${bed.bedNumber}? This cannot be undone.`)) {
            this.api.deleteData(`bed/${bed.id}`).subscribe({
                next: () => {
                    this.snackBar.open('Bed deleted successfully', 'Close', { duration: 3000 });
                    this.loadRooms();
                },
                error: (err: any) => {
                    this.snackBar.open(err.error?.message || 'Error deleting bed', 'Close', { duration: 3000 });
                }
            });
        }
    }

    loadRooms(): void {
        this.isLoading = true;
        this.api.getData(`room?floorId=${this.floorId}`).subscribe({
            next: (res: any) => {
                this.rooms = res;
                this.isLoading = false;
            },
            error: (err: any) => {
                this.snackBar.open(err.error?.message || 'Error loading rooms', 'Close', { duration: 3000 });
                this.isLoading = false;
            }
        });
    }

    loadStudents(): void {
        this.api.getData('students').subscribe({
            next: (res: any) => {
                // Only show students who don't have an active allocation
                this.students = (res.data || []).filter((s: any) => !s.isAllocated);
            },
            error: (err: any) => {
                this.snackBar.open(err.error?.message || 'Error loading students', 'Close', { duration: 3000 });
            }
        });
    }

    openAddRoom(): void {
        this.showAddRoomModal = true;
    }

    closeAddRoom(): void {
        this.showAddRoomModal = false;
        this.newRoom = { roomNumber: '', type: 'SINGLE', basePrice: 0 };
    }

    saveRoom(): void {
        if (!this.floorId) {
            this.snackBar.open('Please select a floor before creating a room', 'Close', { duration: 3000 });
            return;
        }

        if (!this.newRoom.roomNumber || !this.newRoom.roomNumber.trim()) {
            this.snackBar.open('Room number is required', 'Close', { duration: 3000 });
            return;
        }

        if (!this.newRoom.basePrice || this.newRoom.basePrice <= 0) {
            this.snackBar.open('Base price must be greater than 0', 'Close', { duration: 3000 });
            return;
        }

        const payload = {
            ...this.newRoom,
            roomNumber: this.newRoom.roomNumber.trim(),
            floorId: this.floorId
        };

        this.api.postData('room', payload).subscribe({
            next: () => {
                this.snackBar.open('Room created successfully', 'Close', { duration: 3000 });
                this.closeAddRoom();
                this.loadRooms();
            },
            error: (err: any) => {
                this.snackBar.open(err.error?.message || 'Error saving room', 'Close', { duration: 3000 });
            }
        });
    }

    openEditRoom(room: any): void {
        this.editRoomData = {
            id: room.id,
            roomNumber: room.roomNumber,
            type: room.type,
            basePrice: room.currentPrice,
            status: room.status
        };
        this.showEditRoomModal = true;
    }

    closeEditRoom(): void {
        this.showEditRoomModal = false;
        this.editRoomData = { id: null, roomNumber: '', type: '', basePrice: 0, status: '' };
    }

    updateRoomInfo(): void {
        if (!this.editRoomData.roomNumber || !this.editRoomData.basePrice) return;

        this.api.putData(`room/${this.editRoomData.id}`, this.editRoomData).subscribe({
            next: () => {
                this.snackBar.open('Room updated successfully', 'Close', { duration: 3000 });
                this.closeEditRoom();
                this.loadRooms();
            },
            error: (err: any) => {
                this.snackBar.open(err.error?.message || 'Error updating room', 'Close', { duration: 3000 });
            }
        });
    }

    confirmDeleteRoom(room: any): void {
        const hasOccupiedBeds = room.beds.some((b: any) => b.status === 'OCCUPIED');
        if (hasOccupiedBeds) {
            this.snackBar.open('Cannot delete room with occupied beds', 'Close', { duration: 3000 });
            return;
        }

        if (confirm(`Are you sure you want to delete Room ${room.roomNumber}?`)) {
            this.api.deleteData(`room/${room.id}`).subscribe({
                next: () => {
                    this.snackBar.open('Room deleted successfully', 'Close', { duration: 3000 });
                    this.loadRooms();
                },
                error: (err: any) => {
                    this.snackBar.open(err.error?.message || 'Error deleting room', 'Close', { duration: 3000 });
                }
            });
        }
    }

    openAllocation(room: any, bed: any): void {
        if (bed.status !== 'AVAILABLE') return;
        this.selectedRoom = room;
        this.selectedBed = bed;
        this.loadStudents(); // Refresh list to get latest allocation status
        this.showAllocationModal = true;
    }

    closeAllocation(): void {
        this.showAllocationModal = false;
        this.selectedBed = null;
        this.selectedRoom = null;
        this.allocationData = {
            userId: '',
            startDate: new Date().toISOString().split('T')[0],
            allocationType: 'REGULAR'
        };
    }

    allocateBed(): void {
        if (!this.allocationData.userId) return;

        const payload = {
            userId: +this.allocationData.userId,
            bedId: this.selectedBed.id,
            startDate: this.allocationData.startDate,
            allocationType: this.allocationData.allocationType
        };

        this.api.postData('room-allocation', payload).subscribe({
            next: () => {
                this.snackBar.open('Bed allocated successfully', 'Close', { duration: 3000 });
                this.closeAllocation();
                this.loadRooms();
            },
            error: (err: any) => {
                this.snackBar.open(err.error?.message || 'Error allocating bed', 'Close', { duration: 3000 });
            }
        });
    }

    addBed(room: any): void {
        const nextBedNumber = room.beds.length + 1;
        const payload = {
            roomId: room.id,
            bedNumber: nextBedNumber.toString()
        };

        this.api.postData('bed', payload).subscribe({
            next: () => {
                this.snackBar.open(`Bed ${nextBedNumber} added to Room ${room.roomNumber}`, 'Close', { duration: 3000 });
                this.loadRooms();
            },
            error: (err: any) => {
                this.snackBar.open(err.error?.message || 'Error adding bed', 'Close', { duration: 3000 });
            }
        });
    }

    openPayment(room: any, bed: any): void {
        this.selectedRoom = room;
        this.selectedBed = bed;
        if (bed.allocations && bed.allocations[0]) {
            this.paymentData.amountPaid = bed.allocations[0].monthlyRent;
        }
        this.showPaymentModal = true;
    }

    closePayment(): void {
        this.showPaymentModal = false;
        this.paymentData = {
            amountPaid: 0,
            forMonth: new Date().getMonth() + 1,
            forYear: new Date().getFullYear(),
            notes: ''
        };
    }

    savePayment(): void {
        const alloc = this.selectedBed?.allocations?.[0];
        if (!alloc) return;

        const payload = {
            allocationId: alloc.id,
            ...this.paymentData
        };

        this.api.postData('payment', payload).subscribe({
            next: () => {
                this.snackBar.open('Payment recorded successfully', 'Close', { duration: 3000 });
                this.closePayment();
                this.loadRooms();
            },
            error: (err: any) => {
                this.snackBar.open(err.error?.message || 'Error recording payment', 'Close', { duration: 3000 });
            }
        });
    }

    getMonthName(m: number): string {
        return new Date(2000, m - 1).toLocaleString('default', { month: 'long' });
    }

    getBedColor(status: string): string {
        switch (status) {
            case 'AVAILABLE': return '#10b981'; // Green
            case 'OCCUPIED': return '#ef4444'; // Red
            case 'MAINTENANCE': return '#f59e0b'; // Orange
            default: return '#6b7280'; // Gray
        }
    }

    // --- Transfer Methods ---
    openTransfer(bed: any): void {
        const alloc = bed.allocations?.[0];
        if (!alloc) {
            this.snackBar.open('No active allocation found for this bed', 'Close', { duration: 3000 });
            return;
        }
        this.transferData.allocationId = alloc.id;
        this.transferData.newBedId = null;
        this.loadAvailableBeds();
        this.showTransferModal = true;
    }

    loadAvailableBeds(): void {
        const beds: any[] = [];
        this.rooms.forEach(r => {
            r.beds.forEach((b: any) => {
                if (b.status === 'AVAILABLE') {
                    beds.push({
                        id: b.id,
                        roomNumber: r.roomNumber,
                        bedNumber: b.bedNumber
                    });
                }
            });
        });
        this.availableBeds = beds;
    }

    closeTransfer(): void {
        this.showTransferModal = false;
        this.transferData = {
            allocationId: null,
            newBedId: null,
            transferDate: new Date().toISOString().split('T')[0]
        };
    }

    saveTransfer(): void {
        if (!this.transferData.newBedId) {
            this.snackBar.open('Please select a target bed', 'Close', { duration: 3000 });
            return;
        }

        this.api.postData('room-allocation/transfer', this.transferData).subscribe({
            next: () => {
                this.snackBar.open('Room transfer successful', 'Close', { duration: 3000 });
                this.closeTransfer();
                this.loadRooms();
            },
            error: (err: any) => {
                this.snackBar.open(err.error?.message || 'Error transferring student', 'Close', { duration: 3000 });
            }
        });
    }

    checkoutStudent(bed: any): void {
        const alloc = bed.allocations?.[0];
        if (!alloc) return;

        const confirmMsg = alloc.plannedCheckoutDate
            ? `Finalize checkout for ${alloc.user?.name}? Planned was ${new Date(alloc.plannedCheckoutDate).toLocaleDateString()}.`
            : `Checkout student ${alloc.user?.name}?`;

        if (confirm(confirmMsg)) {
            const payload = {
                allocationId: alloc.id,
                checkoutDate: new Date().toISOString().split('T')[0]
            };

            this.api.postData('room-allocation/final-checkout', payload).subscribe({
                next: (res: any) => {
                    this.checkoutSummary = res.summary;
                    this.snackBar.open('Student checked out successfully', 'Close', { duration: 5000 });
                    if (res.summary.extraCharge > 0) {
                        alert(`Late Checkout! Days extra: ${res.summary.daysLate}. Please collect extra charge: ₹${res.summary.extraCharge}`);
                    }
                    this.loadRooms();
                },
                error: (err: any) => {
                    this.snackBar.open(err.error?.message || 'Error checking out student', 'Close', { duration: 3000 });
                }
            });
        }
    }

    openNotice(bed: any): void {
        const alloc = bed.allocations?.[0];
        if (!alloc) return;
        this.noticeData.allocationId = alloc.id;
        this.showNoticeModal = true;
    }

    closeNotice(): void {
        this.showNoticeModal = false;
        this.noticeData = {
            allocationId: null,
            plannedDate: new Date().toISOString().split('T')[0],
            dailyCharge: null
        };
    }

    saveNotice(): void {
        this.api.postData('room-allocation/notice', this.noticeData).subscribe({
            next: () => {
                this.snackBar.open('Departure notice recorded', 'Close', { duration: 3000 });
                this.closeNotice();
                this.loadRooms();
            },
            error: (err: any) => {
                this.snackBar.open(err.error?.message || 'Error recording notice', 'Close', { duration: 3000 });
            }
        });
    }
}
