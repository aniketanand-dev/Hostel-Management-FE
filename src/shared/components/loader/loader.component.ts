import { Component, inject } from '@angular/core';
import { LoadingService } from '../../../app/core/services/loading.service';

@Component({
    selector: 'app-loader',
    standalone: true,
    imports: [],
    templateUrl: './loader.component.html',
    styleUrl: './loader.component.scss'
})
export class LoaderComponent {
    loadingService = inject(LoadingService);
}
