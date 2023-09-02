import { Component } from '@angular/core';
import { map } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import { ProductModel } from 'src/app/models/Productmodel';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/shared/shared.service';
import { CartService } from 'src/app/services/cart.service';
import { NgToastService } from 'ng-angular-popup';
import { SortingType } from 'src/app/enums/sorting-type';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent {
  public searchKey: string = '';
  public sortingType: string = '';
  public selectedCatergorySubCategory: string = '';
  public loading: boolean = true;
  public productsArray!: ProductModel[];
  public filterProducts!: ProductModel[];
  public noProductToShow: boolean = false;
  public page: number = 1;
  public count: number = 0;
  public tableSize: number = 8;

  constructor(
    private productService: ProductService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private cartService: CartService,
    private toaster: NgToastService
  ) {}
  ngOnInit() {
    this.getProducts();
    this.sharedService.searchItem.subscribe((searchItem) => {
      this.filterProducts = this.productsArray;
      this.page = 1;
      this.searchKey = searchItem;
    });
  }
  public getProducts(): void {
    let products = this.productService.getProducts();
    products
      .pipe(
        map((product: any) => {
          const products = [];
          for (const key in product) {
            products.push({ ...product[key], id: key });
          }
          this.filterProducts = products;
          this.productsArray = products;
        })
      )
      .subscribe(() => {
        this.loading = false;
      });
  }
  public showProductDetail(productId: number): void {
    this.sharedService.searchItem.next('');
    this.router.navigate([productId], {
      relativeTo: this.activatedRoute,
    });
  }
  public getSearchItem(): void {
    this.sharedService.searchItem.subscribe((searchItem) => {
      this.page = 1;
      this.searchKey = searchItem;
    });
  }
  public getCategorySubCategoryType(CategorySubCategoryType: any): void {
    this.selectedCatergorySubCategory = CategorySubCategoryType;
    this.getFilterProducts();
  }
  public getFilterProducts(): void {
    this.page = 1;
    this.filterProducts = [];
    this.productsArray.filter((product: any) => {
      if (
        product.category.includes(this.selectedCatergorySubCategory) ||
        product.subCategory.includes(this.selectedCatergorySubCategory)
      ) {
        this.filterProducts.push(product);
      }
    });
  }
  public addToCart(productId: any): void {
    this.productService.getSingleProduct(productId).subscribe((item: any) => {
      const product = {
        ...item,
        id: productId,
      };
      this.cartService.addtoCart(product);
      this.toaster.success({
        detail: item.title,
        summary: 'added to cart',
        duration: 1500,
      });
    });
  }
  public getSortingType(filterType: string): void {
    if (filterType == SortingType.HightoLow) {
      this.sortingType = SortingType.HightoLow;
    } else if (filterType == SortingType.LowtoHigh) {
      this.sortingType = SortingType.LowtoHigh;
    } else if (filterType == SortingType.Default) {
      this.sortingType = SortingType.Default;
    } else {
      this.sortingType = SortingType.Default;
    }
  }
  onTableDataChange(event: any) {
    this.page = event;
    window.scrollTo(0, 0);
  }
}
