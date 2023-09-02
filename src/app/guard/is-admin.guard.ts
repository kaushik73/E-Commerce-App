import { Injectable } from '@angular/core';
import { AdminService } from '../admin/services/admin.service';

@Injectable({
  providedIn: 'root',
})
export class IsAdminGuard {
  canActivate(): boolean {
    let isAdmin = 0;
    isAdmin = JSON.parse(localStorage.getItem('isAdmin') || 'NAN');
    if (isAdmin === 1) {
      return true;
    } else {
      return false;
    }
  }
}
