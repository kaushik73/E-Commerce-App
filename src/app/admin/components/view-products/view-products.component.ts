import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { ProductModel } from 'src/app/models/Productmodel';
import { ProductService } from 'src/app/services/product.service';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-show-products',
  templateUrl: './view-products.component.html',
  styleUrls: ['./view-products.component.css'],
})
export class ViewProductsComponent {
  public products!: ProductModel[];
  public loading: boolean = true;
  public page: number = 1;
  public count: number = 0;
  public tableSize: number = 8;
  constructor(
    private productService: ProductService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private adminService: AdminService
  ) {}
  ngOnInit(): void {
    this.getProducts();
  }
  public getProducts(): void {
    this.productService
      .getProducts()
      .pipe(
        map((product: any) => {
          const products = [];
          for (const key in product) {
            products.push({ ...product[key], id: key });
          }
          this.products = products;
        })
      )
      .subscribe(() => {
        this.loading = false;
      });
  }
  public showProductDetail(productId: any): void {
    this.router.navigate([productId], {
      relativeTo: this.activatedRoute,
    });
  }
  public editProduct(productId: any): void {
    this.adminService.editProductMode.next(true);
    this.router.navigate(['../add-product'], {
      queryParams: { id: productId },
      relativeTo: this.activatedRoute,
    });
  }
  public onTableDataChange(event: any) {
    this.page = event;
  }
}
