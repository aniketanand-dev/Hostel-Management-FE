import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MaterialModule } from "../../shared/materials/materials.module";
import { UserService } from '../../app/core/services/user.service';
export interface PeriodicElement {
    name: string;
    position: number;
    weight: number;
    symbol: string;
}

@Component({
    selector: 'app-student',
    imports: [MatTableModule, MatIconModule, MatMenuModule, MatButtonModule, MaterialModule],
    templateUrl: './student.component.html',
    styleUrl: './student.component.scss'
})
export class StudentComponent implements OnInit {
    displayedColumns: string[] = ['id', 'name', 'email'];
    dataSource: any = [];

    constructor(
        private userService: UserService
    ) { }

    ngOnInit(): void {
        this.userService.getStudent().subscribe({
            next: (res) => {
                this.dataSource = res.data.map((item: { User: { id: any; name: any; email: any; }; }) => ({
                    id: item.User.id,
                    name: item.User.name,
                    email: item.User.email
                }));

            }, error: (err) => {
                console.log(err);

            }
        })

    }

}
