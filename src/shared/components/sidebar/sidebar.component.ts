import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-sidebar',
    imports: [CommonModule, RouterLink, MatListModule, MatIconModule],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
    @Output() navigate = new EventEmitter<void>();
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
