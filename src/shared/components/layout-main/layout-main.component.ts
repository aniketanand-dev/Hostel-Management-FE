import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-layout-main',
    imports: [
        CommonModule,
        RouterOutlet,
        SidebarComponent,
        NavbarComponent,
        MatSidenavModule,
        MatToolbarModule,
        MatIconModule,
        MatListModule,
        MatButtonModule
    ],
    templateUrl: './layout-main.component.html',
    styleUrl: './layout-main.component.scss'
})
export class LayoutMainComponent {
    @ViewChild('sidenav') sidenav!: MatSidenav;
    isMobile = false;
    private sub!: Subscription;

    constructor(private breakpointObserver: BreakpointObserver) { }

    ngOnInit(): void {

    }

    ngAfterViewInit(): void {
        this.sub = this.breakpointObserver
            .observe([Breakpoints.Handset, Breakpoints.Tablet])
            .subscribe(result => {
                this.isMobile = result.matches;
                if (this.isMobile && this.sidenav.opened) {
                    this.sidenav.close();
                } else if (!this.isMobile && !this.sidenav.opened) {
                    this.sidenav.open();
                }
            });
    }


    ngOnDestroy(): void {
        this.sub?.unsubscribe();
    }
}
