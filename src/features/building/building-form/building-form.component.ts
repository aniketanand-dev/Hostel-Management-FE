import { Component } from '@angular/core';
import { MaterialModule } from '../../../shared/materials/materials.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OnBoardingService } from './../../../app/core/services/on-boarding.service';

@Component({
    selector: 'app-building-form',
    imports: [MaterialModule],
    templateUrl: './building-form.component.html',
    styleUrl: './building-form.component.scss'
})
export class BuildingFormComponent {
    buildingForm: FormGroup;
    isSubmitting = false;

    constructor(
        private fb: FormBuilder,
        private snackBar: MatSnackBar,
        private onBoardingService: OnBoardingService
    ) {
        this.buildingForm = this.fb.group({
            buildingName: ['', [Validators.required, Validators.minLength(2)]]
        });
    }

    submit() {
        if (this.buildingForm.invalid) return;

        this.isSubmitting = true;

        this.onBoardingService.createBuilding(this.buildingForm.value)
            .subscribe({
                next: () => {
                    this.snackBar.open('Building created successfully', 'Close', {
                        duration: 3000
                    });
                    this.buildingForm.reset();
                    this.isSubmitting = false;
                },
                error: (err) => {
                    this.snackBar.open(
                        err?.error?.message || 'Failed to create building',
                        'Close',
                        { duration: 3000 }
                    );
                    this.isSubmitting = false;
                }
            });
    }
}
