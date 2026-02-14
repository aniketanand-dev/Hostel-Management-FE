import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../app/core/services/user.service';
import { OnBoardingService } from '../../../app/core/services/on-boarding.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'app-student-form',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatDividerModule,
        MatSnackBarModule,
        MatSlideToggleModule,
        MatTooltipModule],
    templateUrl: './student-form.component.html',
    styleUrl: './student-form.component.scss'
})
export class StudentFormComponent {
    studentForm!: FormGroup;
    roleName: 'STAFF' | 'STUDENT' = 'STUDENT';
    studentId: number | null = null;
    isEditMode = false;
    selectedProfilePhoto: File | null = null;
    selectedAadhaarPhoto: File | null = null;
    verifiedIdentity: any = null;
    verifiedPhoto: string | null = null;
    otpSent = false;
    otpValue = '';
    clientId = '';

    baseUrl = 'http://localhost:5000/';
    existingProfilePhoto: string | null = null;
    existingAadhaarPhoto: string | null = null;
    profilePreview: string | null = null;
    aadhaarPreview: string | null = null;

    verificationMode: 'OFFLINE' | 'ONLINE' = 'OFFLINE';
    selectedKycFile: File | null = null;
    shareCode = '';

    floors: any[] = [];
    rooms: any[] = [];
    beds: any[] = [];
    buildings: any[] = [];
    currentBuildingId: number | null = null;
    currentFloorId: number | null = null;
    currentRoomId: number | null = null;

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private route: ActivatedRoute,
        private router: Router,
        private snackBar: MatSnackBar,
        private onboardingService: OnBoardingService
    ) {
        this.createForm();
        this.readQueryParams();
    }

    createForm() {
        this.studentForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            gender: [''],
            isActive: [true],
            aadhaarNumber: [''],
            passportNumber: [''],
            parentAadhaarNumber: [''],
            permanentAddress: [''],
            workingAddress: [''],
            temporaryAddress: [''],
            isAadhaarVerified: [false],
            phoneNumber: [''],
            fatherName: [''],
            fatherPhoneNumber: [''],
            motherName: [''],
            motherPhoneNumber: [''],
            guardianName: [''],
            guardianPhoneNumber: [''],
            emergencyContactNumber: [''],
            bedId: [null]
        });
    }

    goBack() {
        this.router.navigate([this.roleName === 'STUDENT' ? '/students' : '/staffs']);
    }

    onFileSelected(event: any, field: string) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (field === 'profilePhoto') {
                    this.selectedProfilePhoto = file;
                    this.profilePreview = reader.result as string;
                } else if (field === 'aadhaarPhoto') {
                    this.selectedAadhaarPhoto = file;
                    this.aadhaarPreview = reader.result as string;
                }
            };
            reader.readAsDataURL(file);
        }
    }

    loadBuildings() {
        this.onboardingService.getBuilding(true).subscribe(res => {
            this.buildings = Array.isArray(res) ? res : (res.data || []);
        });
    }

    onBuildingChange(buildingId: any, skipReset = false) {
        this.currentBuildingId = buildingId;
        this.floors = [];
        this.rooms = [];
        this.beds = [];
        if (!skipReset) {
            this.currentFloorId = null;
            this.currentRoomId = null;
            this.studentForm.patchValue({ bedId: null });
        }
        this.onboardingService.getFloors(buildingId, true).subscribe(res => {
            this.floors = Array.isArray(res) ? res : (res.data || []);
        });
    }

    onFloorChange(floorId: any, skipReset = false) {
        this.currentFloorId = floorId;
        this.rooms = [];
        this.beds = [];
        if (!skipReset) {
            this.currentRoomId = null;
            this.studentForm.patchValue({ bedId: null });
        }
        this.onboardingService.getRooms(floorId, true).subscribe(res => {
            this.rooms = Array.isArray(res) ? res : (res.data || []);
        });
    }

    onRoomChange(roomId: any, skipReset = false) {
        this.currentRoomId = roomId;
        this.beds = [];
        if (!skipReset) {
            this.studentForm.patchValue({ bedId: null });
        }
        this.onboardingService.getBeds(roomId).subscribe(res => {
            const bedList = Array.isArray(res) ? res : (res.data || []);
            // Show available beds OR the current bed if in edit mode
            const currentBedId = this.studentForm.get('bedId')?.value;
            this.beds = bedList.filter((b: any) => b.status === 'AVAILABLE' || b.id === currentBedId);
        });
    }

    verifyAadhaar() {
        const aadhaar = this.studentForm.get('aadhaarNumber')?.value;
        const name = this.studentForm.get('name')?.value;

        if (!name) {
            this.snackBar.open('Please enter Full Name first to match against Aadhaar', 'Close', { duration: 3000 });
            return;
        }

        if (!aadhaar || aadhaar.length !== 12) {
            this.snackBar.open('Please enter a valid 12-digit Aadhaar number', 'Close', { duration: 3000 });
            return;
        }

        this.snackBar.open('Verifying Identity...', 'Please wait');

        this.userService.verifyAadhaar(aadhaar, name).subscribe({
            next: (res: any) => {
                if (res.success) {
                    this.verifiedIdentity = res.data.identity;
                    this.clientId = res.data.clientId;
                    this.otpSent = true;
                    this.snackBar.open(res.message, 'Close', { duration: 5000 });
                } else {
                    this.studentForm.patchValue({ isAadhaarVerified: false });
                    this.verifiedIdentity = null;
                    this.otpSent = false;
                    this.snackBar.open(res.message || 'Verification failed', 'Close', { duration: 3000 });
                }
            },
            error: (err) => {
                this.studentForm.patchValue({ isAadhaarVerified: false });
                this.verifiedIdentity = null;
                this.otpSent = false;
                this.snackBar.open(err.error?.message || 'Verification service error', 'Close', { duration: 3000 });
            }
        });
    }

    submitOtp() {
        if (!this.otpValue || this.otpValue.length !== 6) {
            this.snackBar.open('Please enter a valid 6-digit OTP', 'Close', { duration: 3000 });
            return;
        }

        this.userService.verifyAadhaarOtp(this.otpValue, this.clientId).subscribe({
            next: (res: any) => {
                if (res.success) {
                    this.studentForm.patchValue({ isAadhaarVerified: true });
                    this.otpSent = false; // Hide OTP input
                    this.snackBar.open('Aadhaar OTP verified successfully!', 'Close', {
                        duration: 3000,
                        panelClass: ['success-snackbar']
                    });
                } else {
                    this.snackBar.open(res.message || 'OTP verification failed', 'Close', { duration: 3000 });
                }
            },
            error: (err) => {
                this.snackBar.open(err.error?.message || 'OTP service error', 'Close', { duration: 3000 });
            }
        });
    }

    onKycFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            this.selectedKycFile = file;
        }
    }

    onOfflineKycVerify() {
        if (!this.selectedKycFile || !this.shareCode) {
            this.snackBar.open('Please select the KYC ZIP file and enter 4-digit Share Code', 'Close', { duration: 3000 });
            return;
        }

        const formData = new FormData();
        formData.append('kycFile', this.selectedKycFile);
        formData.append('shareCode', this.shareCode);

        this.snackBar.open('Processing Aadhaar Offline KYC...', 'Wait');

        this.userService.verifyOfflineKyc(formData).subscribe({
            next: (res: any) => {
                if (res.success) {
                    const data = res.data;
                    // Automatically fill the form with verified data
                    this.studentForm.patchValue({
                        name: data.name,
                        gender: data.gender,
                        permanentAddress: data.address,
                        isAadhaarVerified: true
                    });

                    this.verifiedIdentity = {
                        name: data.name,
                        fatherName: data.fatherName || 'Verified via e-KYC',
                        dob: data.dob,
                        address: data.address
                    };
                    this.verifiedPhoto = data.photo;

                    this.snackBar.open('Identity Verified via Offline e-KYC!', 'Close', {
                        duration: 5000,
                        panelClass: ['success-snackbar']
                    });
                } else {
                    this.snackBar.open(res.message || 'KYC Processing failed', 'Close', { duration: 3000 });
                }
            },
            error: (err) => {
                this.snackBar.open(err.error?.message || 'KYC service error', 'Close', { duration: 3000 });
            }
        });
    }

    readQueryParams() {
        this.route.queryParams.subscribe((params: any) => {
            if (params['type'] === 'staff') {
                this.roleName = 'STAFF';
            } else {
                this.roleName = 'STUDENT';
            }

            if (this.roleName === 'STUDENT') {
                this.loadBuildings();
            }

            if (params['id']) {
                this.studentId = +params['id'];
                this.isEditMode = true;
                this.loadUserData(this.studentId.toString());
            }
        });
    }

    loadUserData(id: string) {
        const obs = this.roleName === 'STAFF'
            ? this.userService.getStaffById(id)
            : this.userService.getStudentById(id);

        obs.subscribe({
            next: (res: any) => {
                if (res.success) {
                    const data = res.data;
                    this.studentForm.patchValue({
                        name: data.name,
                        email: data.email,
                        gender: data.gender || '',
                        isActive: data.isActive !== undefined ? data.isActive : true,
                        aadhaarNumber: data.aadhaarNumber || '',
                        passportNumber: data.passportNumber || '',
                        parentAadhaarNumber: data.parentAadhaarNumber || '',
                        permanentAddress: data.permanentAddress || '',
                        workingAddress: data.workingAddress || '',
                        temporaryAddress: data.temporaryAddress || '',
                        isAadhaarVerified: !!data.isAadhaarVerified,
                        phoneNumber: data.phoneNumber || '',
                        fatherName: data.fatherName || '',
                        fatherPhoneNumber: data.fatherPhoneNumber || '',
                        motherName: data.motherName || '',
                        motherPhoneNumber: data.motherPhoneNumber || '',
                        guardianName: data.guardianName || '',
                        guardianPhoneNumber: data.guardianPhoneNumber || '',
                        emergencyContactNumber: data.emergencyContactNumber || '',
                        bedId: data.RoomAllocations?.[0]?.bedId || null
                    });

                    // Pre-fill Floor and Room dropdowns for bed allocation
                    const activeAlloc = data.RoomAllocations?.find((a: any) => a.status === 'ACTIVE');
                    if (activeAlloc && activeAlloc.bed) {
                        const bed = activeAlloc.bed;
                        const roomId = bed.roomId;
                        const floorId = bed.room?.floorId;
                        const buildingId = bed.room?.floor?.buildingId;

                        if (buildingId) {
                            this.currentBuildingId = buildingId;
                            this.onBuildingChange(buildingId, true);
                        }
                        if (floorId) {
                            this.currentFloorId = floorId;
                            this.onFloorChange(floorId, true);
                        }
                        if (roomId) {
                            this.currentRoomId = roomId;
                            this.onRoomChange(roomId, true);
                        }
                    }

                    this.existingProfilePhoto = data.profilePhoto || null;
                    this.existingAadhaarPhoto = data.aadhaarPhoto || null;

                    // Load saved identity data for the card
                    if (data.isAadhaarVerified && data.aadhaarVerifiedData) {
                        try {
                            const verifiedData = typeof data.aadhaarVerifiedData === 'string'
                                ? JSON.parse(data.aadhaarVerifiedData)
                                : data.aadhaarVerifiedData;

                            this.verifiedIdentity = verifiedData.identity || verifiedData;
                            this.verifiedPhoto = verifiedData.photo || null;
                            // Ensure the checkbox/status in form is also sync'd
                            this.studentForm.patchValue({ isAadhaarVerified: true }, { emitEvent: false });
                        } catch (e) {
                            console.error('Error parsing aadhaarVerifiedData', e);
                        }
                    }
                }
            }
        });
    }

    onSubmit() {
        if (this.studentForm.valid) {
            const formData = new FormData();
            const formValue = this.studentForm.value;

            // Add all fields except those we handle specially or files
            Object.keys(formValue).forEach(key => {
                if (key !== 'isAadhaarVerified') {
                    formData.append(key, formValue[key]);
                }
            });

            formData.append('roleName', this.roleName);
            formData.append('isActive', 'true');
            formData.append('isAadhaarVerified', this.studentForm.get('isAadhaarVerified')?.value ? 'true' : 'false');

            // Add files
            if (this.selectedProfilePhoto) {
                formData.append('profilePhoto', this.selectedProfilePhoto);
            }
            if (this.selectedAadhaarPhoto) {
                formData.append('aadhaarPhoto', this.selectedAadhaarPhoto);
            }

            if (this.verifiedIdentity) {
                const dataToSave = {
                    ...this.verifiedIdentity,
                    photo: this.verifiedPhoto
                };
                formData.append('aadhaarVerifiedData', JSON.stringify(dataToSave));
            }

            const obs = this.isEditMode && this.studentId
                ? this.userService.updateUser(this.studentId, formData)
                : this.userService.createUser(formData);

            obs.subscribe({
                next: (res) => {
                    this.snackBar.open(`${this.roleName} ${this.isEditMode ? 'updated' : 'created'} successfully`, 'Close', {
                        duration: 3000,
                        panelClass: ['success-snackbar']
                    });
                    this.router.navigate([this.roleName === 'STUDENT' ? '/students' : '/staffs']);
                },
                error: (err) => {
                    this.snackBar.open(err.error?.message || `Error ${this.isEditMode ? 'updating' : 'creating'} user`, 'Close', {
                        duration: 3000
                    });
                }
            });
        }
    }
}

