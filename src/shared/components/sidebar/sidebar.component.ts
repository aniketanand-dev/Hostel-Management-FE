import { Component, HostListener, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import { MaterialModule } from '../../../shared/materials/materials.module';

@Component({
    selector: 'app-sidebar',
    imports: [CommonModule, RouterLink, MatSidenavModule, MatListModule, MatIconModule, MatToolbarModule, RouterOutlet, MaterialModule],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
    @Input() features: any[] = [];
    isMobile: boolean = false;

    constructor() {
        this.checkScreen();
    }

    @HostListener('window:resize', ['$event'])
    onResize() {
        this.checkScreen();
    }

    checkScreen() {
        this.isMobile = window.innerWidth < 768;
    }
}
