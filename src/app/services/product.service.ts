import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryModel } from '../models/CategoryModel';
import { ProductModel } from '../models/Productmodel';
import { HttpServiceService } from '../shared/http-service.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  allProducts!: ProductModel[];
  categories!: CategoryModel[];
  constructor(private httpService: HttpServiceService) {}
  getProducts(): Observable<Object> {
    return this.httpService.getData(`products-data.json`);
  }
  getSingleProduct(productId: string) {
    return this.httpService.getData(`products-data/${productId}.json`);
  }
  sendProduct(product: any) {
    return this.httpService.sendData('products-data.json', product);
  }
}
