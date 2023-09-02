import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AddCategoryComponent } from './components/add-category/add-category.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { OrdersComponent } from './components/orders/orders.component';
import { ViewProductComponent } from './components/view-product/view-product.component';
import { ViewProductsComponent } from './components/view-products/view-products.component';
import { UsersComponent } from './components/users/users.component';
import { WarningGuard } from '../guard/warning.guard';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
const routes: Routes = [
  {
    path: '',
    component: AdminComponent,

    children: [
      {
        path: 'add-product',
        component: AddProductComponent,
        canDeactivate: [WarningGuard],
      },
      {
        path: 'add-category',
        component: AddCategoryComponent,
      },
      {
        path: 'show-products',
        component: ViewProductsComponent,
      },
      { path: 'show-products/:id', component: ViewProductComponent },

      {
        path: 'orders',
        component: OrdersComponent,
      },
      { path: 'orders/:id', component: OrderDetailComponent },

      {
        path: 'users',
        component: UsersComponent,
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
