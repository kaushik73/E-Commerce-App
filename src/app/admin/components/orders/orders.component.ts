import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { OrdersModel } from 'src/app/models/OrdersModel';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent {
  public ordersList: OrdersModel[] = [];
  public loading: boolean = true;
  constructor(
    private adminService: AdminService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.getAllOrders();
  }
  public getAllOrders(): void {
    this.adminService
      .getOrders()
      .pipe(
        map((order: any) => {
          const orders = [];
          for (const key in order) {
            orders.push({ ...order[key], orderId: key });
          }
          this.ordersList = orders;
        })
      )
      .subscribe(() => (this.loading = false));
  }
  public viewOrderDetail(orderId: string): void {
    this.router.navigate([`/admin/orders/${orderId}`], {
      relativeTo: this.activatedRoute,
    });
  }
}
