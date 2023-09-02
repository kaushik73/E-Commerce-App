import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from './services/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent {
  public selectedTask: string = '';
  public showProductMenu: boolean = false;
  public showOrderMenu: boolean = false;
  public showUsersMenu: boolean = false;
  public showAdminPannel: boolean = true;
  constructor(private adminService: AdminService, private router: Router) {}
  public toggleProductMenu(): void {
    this.showProductMenu = !this.showProductMenu;
  }
  public toggleOrderMenu(): void {
    this.showOrderMenu = !this.showOrderMenu;
  }
  public toggleUserMenu(): void {
    this.showUsersMenu = !this.showUsersMenu;
  }
  public goToAddProduct(): void {
    this.adminService.editProductMode.next(false);
  }
  public logoutAdmin(): void {
    localStorage.setItem('isAdmin', '0');
    this.router.navigate(['/']);
  }
}
