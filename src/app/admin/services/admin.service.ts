import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CategoryModel } from 'src/app/models/CategoryModel';
import { ProductModel } from 'src/app/models/Productmodel';
import { HttpServiceService } from 'src/app/shared/http-service.service';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  editProductMode = new BehaviorSubject<boolean>(false);
  constructor(private httpService: HttpServiceService) {}
  addCategory(category: any): Observable<Object> {
    return this.httpService.sendData('product-categories.json', category);
  }
  getCategories(): Observable<Object> {
    return this.httpService.getData('product-categories.json');
  }
  getCategory(categoryId: string): Observable<Object> {
    return this.httpService.getData(`product-categories/${categoryId}.json`);
  }
  updateCategory(categoryId: any, categoryName: any): Observable<Object> {
    return this.httpService.updateData(
      `product-categories/${categoryId}.json`,
      categoryName
    );
  }
  getUsers(): Observable<Object> {
    return this.httpService.getData('user-data.json');
  }
  getProducts(): Observable<Object> {
    return this.httpService.getData(`products-data.json`);
  }
  getOrders(): Observable<Object> {
    return this.httpService.getData('carts-data.json');
  }
  addSubCategory(categoryId: string, category: any): void {
    this.httpService
      .updateData(`product-categories/${categoryId}.json`, category)
      .subscribe();
  }
  updateSubCategory(categoryId: string, category: CategoryModel): void {
    this.httpService
      .updateData(`product-categories/${categoryId}.json`, category)
      .subscribe();
  }
  updateProduct(productId: string, product: ProductModel): Observable<Object> {
    return this.httpService.updateData(
      `products-data/${productId}.json`,
      product
    );
  }
  updateProductCategory(
    productId: string,
    productUpdatedCategory: string
  ): Observable<Object> {
    return this.httpService.updateData(
      `products-data/${productId}.json`,
      productUpdatedCategory
    );
  }
  getOrdersOfUser(orderId: string) {
    return this.httpService.getData(`carts-data/${orderId}.json`);
  }
}
