import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-data-table',
    imports: [CommonModule],
    templateUrl: './data-table.component.html',
    styleUrl: './data-table.component.scss'
})
export class DataTableComponent {
    @Input() rows: any[] = [];
    @Input() columns: any[] = [];
    @Input() actions: any[] = [];

}
