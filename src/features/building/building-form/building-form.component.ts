import { Component } from '@angular/core';
import { MaterialModule } from '../../../shared/materials/materials.module';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { OnBoardingService } from './../../../app/core/services/on-boarding.service';

@Component({
    selector: 'app-building-form',
    imports: [MaterialModule, CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './building-form.component.html',
    styleUrl: './building-form.component.scss'
})
export class BuildingFormComponent {
    buildingForm: FormGroup;
    isSubmitting = false;
    isEdit = false;
    buildingId: number | null = null;

    constructor(
        private fb: FormBuilder,
        private snackBar: MatSnackBar,
        private onBoardingService: OnBoardingService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.buildingForm = this.fb.group({
            buildingName: ['', [Validators.required, Validators.minLength(2)]]
        });

        this.route.queryParams.subscribe(params => {
            if (params['id']) {
                this.isEdit = true;
                this.buildingId = +params['id'];
                this.buildingForm.patchValue({
                    buildingName: params['name'] || ''
                });
            }
        });
    }

    submit() {
        if (this.buildingForm.invalid) return;

        this.isSubmitting = true;

        const obs = this.isEdit && this.buildingId
            ? this.onBoardingService.updateBuilding(this.buildingId, this.buildingForm.value)
            : this.onBoardingService.createBuilding(this.buildingForm.value);

        obs.subscribe({
            next: () => {
                this.snackBar.open(
                    `Building ${this.isEdit ? 'updated' : 'created'} successfully`,
                    'Close',
                    { duration: 3000 }
                );
                this.router.navigate(['/buildings']);
                this.isSubmitting = false;
            },
            error: (err) => {
                this.snackBar.open(
                    err?.error?.message || `Failed to ${this.isEdit ? 'update' : 'create'} building`,
                    'Close',
                    { duration: 3000 }
                );
                this.isSubmitting = false;
            }
        });
    }
}
