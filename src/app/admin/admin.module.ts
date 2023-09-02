import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AddCategoryComponent } from './components/add-category/add-category.component';
import { ViewProductsComponent } from './components/view-products/view-products.component';
import { UsersComponent } from './components/users/users.component';
import { OrdersComponent } from './components/orders/orders.component';
import { ViewProductComponent } from './components/view-product/view-product.component';
import { AddMarginDirective } from './directive/add-margin.directive';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    AdminComponent,
    AddProductComponent,
    AddCategoryComponent,
    ViewProductsComponent,
    UsersComponent,
    OrdersComponent,
    ViewProductComponent,
    AddMarginDirective,
    OrderDetailComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
  ],
  exports: [AddProductComponent],
})
export class AdminModule {}
