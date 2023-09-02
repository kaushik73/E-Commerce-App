import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrdersModel } from 'src/app/models/OrdersModel';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css'],
})
export class OrderDetailComponent {
  public orderDetail!: OrdersModel;
  public orderId: string = '';
  constructor(
    private adminService: AdminService,
    private activatedRoute: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.getOrderId();
    this.getOrdersDetail();
  }
  private getOrderId(): void {
    this.activatedRoute.paramMap.subscribe((orderId: any) => {
      this.orderId = orderId.get('id');
    });
  }
  public getOrdersDetail(): void {
    this.adminService
      .getOrdersOfUser(this.orderId as string)
      .subscribe((orderDetail: any) => {
        this.orderDetail = orderDetail;
      });
  }
}
