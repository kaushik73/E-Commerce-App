import { Component } from '@angular/core';
import { map } from 'rxjs';
import { UserModel } from 'src/app/models/UserModel';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent {
  public users!: UserModel[];
  public loading: boolean = true;
  constructor(private adminService: AdminService) {}
  ngOnInit(): void {
    this.getUsers();
  }
  public getUsers(): void {
    this.adminService
      .getUsers()
      .pipe(
        map((user: any) => {
          const users = [];
          for (const key in user) {
            users.push({ ...user[key], id: key });
          }
          this.users = users;
        })
      )
      .subscribe(() => {
        this.loading = false;
      });
  }
}
