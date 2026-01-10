import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../app/core/services/user.service';
import { MaterialModule } from '../../shared/materials/materials.module';


@Component({
    selector: 'app-student',
    standalone: true,
    imports: [
        CommonModule,
        MaterialModule
    ],
    templateUrl: './student.component.html',
    styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {

    displayedColumns: string[] = ['id', 'name', 'email', 'action'];
    dataSource: any[] = [];

    constructor(private userService: UserService) { }

    ngOnInit(): void {
        this.userService.getStudent().subscribe(res => {
            this.dataSource = res.data.map((item: any) => ({
                id: item.User.id,
                name: item.User.name,
                email: item.User.email
            }));
        });
    }

    editStudent(row: any) {
        console.log('Edit', row);
    }

    viewStudent(row: any) {
        console.log('View', row);
    }

    deleteStudent(row: any) {
        console.log('Delete', row);
    }
}
