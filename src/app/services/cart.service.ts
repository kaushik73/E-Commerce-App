import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { ProductModel } from '../models/Productmodel';
import { HttpServiceService } from '../shared/http-service.service';
import { AdminService } from '../admin/services/admin.service';
import { OrdersModel } from '../models/OrdersModel';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItemList: ProductModel[] = [];
  productList = new BehaviorSubject<any>([]);
  userHasPreviousCartItems = new BehaviorSubject<string>('0');
  search = new BehaviorSubject<string>('');
  cartId = new BehaviorSubject<string>('');
  public orderList: OrdersModel[] = [];
  constructor(
    private httpService: HttpServiceService,
    private adminService: AdminService
  ) {}
  getProducts(): Observable<Object> {
    return this.productList.asObservable();
  }
  addtoCart(product: any): void {
    this.cartItemList.push(product);
    this.productList.next(this.cartItemList);
  }
  removeCartItem(currentProduct: any): void {
    const indexToRemove = this.cartItemList.findIndex(
      (product: ProductModel) => currentProduct.id === product.id
    );
    this.cartItemList.splice(indexToRemove, 1);
    this.productList.next(this.cartItemList);
  }
  TotalPrice(): number {
    let totalAmount = 0;
    this.cartItemList.map((product: ProductModel) => {
      totalAmount += product.price;
    });
    return totalAmount;
  }
  removeAllCart(): void {
    this.cartItemList = [];
    this.productList.next(this.cartItemList);
  }
  sendCartListToDatabase(cartData: any): Observable<Object> {
    return this.httpService.sendData(`carts-data.json`, cartData);
  }
  updateCartListToDatabase(cartData: any): Observable<Object> {
    let cartId = '';
    this.cartId.subscribe((id) => {
      cartId = id;
    });
    return this.httpService.updateData(`carts-data/${cartId}.json`, cartData);
  }
  public sethasPreviousCartItems(value: string) {
    localStorage.setItem('userHasPreviousCartItems', value);
    this.userHasPreviousCartItems.next(value);
  }
  public getAllOrders(): void {
    this.adminService
      .getOrders()
      .pipe(
        map((order: any) => {
          const orders = [];
          for (const key in order) {
            orders.push({ ...order[key], cartId: key });
          }
          this.orderList = orders;
        })
      )
      .subscribe(() => this.getPreviousCartItemsOfUser());
  }
  getPreviousCartItemsOfUser() {
    for (let i = 0; i < this.orderList.length; i++) {
      if (
        this.orderList[i].userData.userName === localStorage.getItem('userName')
      ) {
        this.cartId.next(this.orderList[i].cartId);
        this.sethasPreviousCartItems('1');
        for (let j = 0; j < this.orderList[i].orders.length; j++) {
          this.addtoCart(this.orderList[i].orders[j]);
        }
      }
    }
  }
}
