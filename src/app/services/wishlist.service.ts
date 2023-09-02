import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductModel } from '../models/Productmodel';
@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  wishItemList: any = [];
  wishProductList = new BehaviorSubject<any>([]);
  search = new BehaviorSubject<string>('');
  getWishlistProducts(): Observable<Object> {
    return this.wishProductList.asObservable();
  }
  addToWishList(product: any): void {
    this.wishItemList.push(product);
    this.wishProductList.next(this.wishItemList);
  }
  removeWishListItem(currentProduct: any): void {
    const indexToRemove = this.wishItemList.findIndex(
      (product: ProductModel) => currentProduct.id === product.id
    );
    this.wishItemList.splice(indexToRemove, 1);
    this.wishProductList.next(this.wishItemList);
  }
  removeAllWishlistItem(): void {
    this.wishItemList = [];
    this.wishProductList.next(this.wishItemList);
  }
}
