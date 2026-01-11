import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../../app/core/services/api.service';
import { RouterModule } from '@angular/router';

export interface Feature {
    name: string;
    path: string;
    icon: string;
}

export interface HomeResponse {
    success: boolean;
    data: {
        hostelId: number;
        features: Feature[];
    };
}

@Component({
    selector: 'app-sidebar',
    imports: [CommonModule, RouterLink, MatListModule, MatIconModule, RouterModule],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
    @Output() navigate = new EventEmitter<void>();

    isMobile: boolean = false;

    features: Feature[] = [];
    hostelId!: number;

    constructor(private api: ApiService) {
        this.checkScreen();
    }

    ngOnInit(): void {

        this.api.getData('home').subscribe({
            next: (res) => {
                this.features = res.data.features;
                this.hostelId = res.data.hostelId;
            },
            error: (err) => console.error(err)
        });
    }

    @HostListener('window:resize')
    onResize() {
        this.checkScreen();
    }

    checkScreen() {
        this.isMobile = window.innerWidth < 768;
    }
}
