import { Pipe, PipeTransform } from '@angular/core';
import { ProductModel } from '../models/Productmodel';
import { SortingType } from '../enums/sorting-type';
@Pipe({
  name: 'sorting',
})
export class SortingPipe implements PipeTransform {
  transform(products: ProductModel[], sortType: string): any {
    let productsArray = [...products];
    if (!products) return [];
    else if (!sortType) return products;
    else if (sortType === SortingType.HightoLow) {
      products.sort((first: ProductModel, second: ProductModel) => {
        return first.price - second.price;
      });
      return products.reverse();
    } else if (sortType === SortingType.LowtoHigh) {
      return products.sort((first: ProductModel, second: ProductModel) => {
        return first.price - second.price;
      });
    } else if (sortType === SortingType.Default) {
      return productsArray;
    } else {
      return productsArray;
    }
  }
}
