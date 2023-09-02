import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { ProductModel } from 'src/app/models/Productmodel';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { WishlistService } from 'src/app/services/wishlist.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent {
  private productId: string = '';
  public productDetail!: ProductModel;
  public loading: boolean = true;
  public noProductExist: boolean = false;
  public allProductsArray: ProductModel[] = [];
  public productCategory: string = '';
  public productImage: string = '';
  public slides: any;
  public showSliderArrows: boolean = true;
  public similarProducts: ProductModel[] = [];
  public currentIndex: number = 0;
  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private toaster: NgToastService
  ) {}
  ngOnInit() {
    this.getProducts();
    this.getProductId();
    this.getProductDetail();
  }
  public getProductId(): void {
    this.activatedRoute.paramMap.subscribe((browserUrl: any) => {
      this.productId = browserUrl.get('id');
    });
  }
  public getProductDetail(): void {
    this.productService
      .getSingleProduct(this.productId)
      .subscribe((productDetail: any) => {
        if (productDetail === null) {
          this.noProductExist = true;
        }
        this.productDetail = productDetail;
        this.slides = this.productDetail.images;
        this.productCategory = this.productDetail.category;
        this.productImage = this.productDetail.thumbnail;
      });
  }
  private getSimilarProducts(): void {
    this.similarProducts = this.allProductsArray.filter(
      (product: ProductModel) => {
        return product.category.includes(this.productCategory);
      }
    );
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
          this.allProductsArray = products;
        })
      )
      .subscribe(() => {
        this.loading = false;
        this.getSimilarProducts();
      });
  }
  public addToCart(): void {
    this.productService
      .getSingleProduct(this.productId)
      .subscribe((item: any) => {
        const product = {
          ...item,
          id: this.productId,
        };
        this.cartService.addtoCart(product);
        this.toaster.success({
          detail: 'Product : ' + item.title,
          summary: 'added to cart',
          duration: 1500,
        });
      });
  }
  public addToWishlist() {
    this.productService
      .getSingleProduct(this.productId)
      .subscribe((item: any) => {
        const product = {
          ...item,
          id: this.productId,
        };
        this.wishlistService.addToWishList(product);
        this.toaster.success({
          detail: 'Product : ' + item.title,
          summary: 'added to wishlist',
          duration: 1500,
        });
      });
  }
  public showSimilarProductDetail(productId: number) {
    this.router.navigateByUrl('/').then(() => {
      this.router.navigate([`/products/${productId}`]);
    });
  }
  // Slider Code Start
  goToPrevious(): void {
    const isFirstSlide = this.currentIndex === 0;
    const newIndex = isFirstSlide
      ? this.slides.length - 1
      : this.currentIndex - 1;
    this.currentIndex = newIndex;
  }
  goToNext(): void {
    const isLastSlide = this.currentIndex === this.slides.length - 1;
    const newIndex = isLastSlide ? 0 : this.currentIndex + 1;
    this.currentIndex = newIndex;
  }
  getCurrentSlideUrl(): string {
    if (this.productDetail.images != undefined) {
      return `url('${this.slides[this.currentIndex]}')`;
    } else {
      this.showSliderArrows = false;
      return `url('${this.productDetail.thumbnail}')`;
    }
  }
  // Slider Code End
}
