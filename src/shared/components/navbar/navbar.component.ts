import { Component, EventEmitter, Output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../app/core/services/auth.service';
@Component({
    selector: 'app-navbar',
    imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
    @Output() menuToggle = new EventEmitter<void>();

    constructor(
        private authService: AuthService
    ) {

    }

    logout() {
        this.authService.logout()
    }
}
