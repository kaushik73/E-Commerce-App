import { Pipe, PipeTransform } from '@angular/core';
import { ProductModel } from '../models/Productmodel';
@Pipe({
  name: 'filters',
})
export class FiltersPipe implements PipeTransform {
  transform(productsArray: ProductModel[], searchKey: string): any[] {
    const filteredProducts: ProductModel[] = [];
    if (!productsArray || searchKey === '') {
      return productsArray;
    }
    productsArray.forEach((product: ProductModel) => {
      if (
        product['category']
          .trim()
          .toLowerCase()
          .includes(searchKey.toLowerCase())
      ) {
        filteredProducts.push(product);
      } else if (
        product['title'].trim().toLowerCase().includes(searchKey.toLowerCase())
      ) {
        filteredProducts.push(product);
      } else if (
        product['subCategory']
          .trim()
          .toLowerCase()
          .includes(searchKey.toLowerCase())
      ) {
        filteredProducts.push(product);
      }
    });
    return filteredProducts;
  }
}
