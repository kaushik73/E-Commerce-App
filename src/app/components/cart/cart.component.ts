import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { ProductModel } from 'src/app/models/Productmodel';
import { CartService } from 'src/app/services/cart.service';
import { WishlistService } from 'src/app/services/wishlist.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
})
export class CartComponent {
  public products: ProductModel[] = [];
  public totalPrice: number = 0;
  constructor(
    private cartService: CartService,
    private router: Router,
    private wishlistService: WishlistService,
    private toaster: NgToastService
  ) {}
  ngOnInit(): void {
    this.cartService.getProducts().subscribe((products: any) => {
      this.products = products;
      this.getTotalPrice();
    });
  }
  public emptyCart(): void {
    this.cartService.removeAllCart();
  }
  public saveCartItemsToDatabase(): void {
    const userName = localStorage.getItem('userName') || '0';
    const userId = localStorage.getItem('userId') || '0';
    // User is not logged in
    if (userName === '0' && userId === '0') {
      this.router.navigate(['/auth/login'], {
        queryParams: { isLogin: false },
      });
      return;
      // User Logged in
    } else {
      let sendCartData;
      let CurrentUserData = {
        userName: localStorage.getItem('userName') || '',
      };
      this.cartService.productList.subscribe((data) => {
        sendCartData = {
          orders: [...data],
          userData: CurrentUserData,
        };
      });
      if (localStorage.getItem('userHasPreviousCartItems') == '1') {
        this.cartService
          .updateCartListToDatabase(sendCartData)
          .subscribe(() => {
            this.toaster.success({
              detail: ' Hii ' + userName.toUpperCase(),
              summary: 'Products Will be Delivered Soon',
              duration: 4000,
            });
          });
      } else {
        this.cartService.sendCartListToDatabase(sendCartData).subscribe(() =>
          this.toaster.success({
            detail: ' Hii ' + userName.toUpperCase(),
            summary: 'Products Will be Delivered Soon',
            duration: 4000,
          })
        );
      }
    }
  }
  public getTotalPrice(): void {
    this.totalPrice = this.cartService.TotalPrice();
  }
  public removeItem(item: any): void {
    this.cartService.removeCartItem(item);
  }
  public addProductToWishlist(item: any): void {
    this.removeItem(item);
    this.wishlistService.addToWishList(item);
  }
  public showProductDetail(productId: number): void {
    this.router.navigate([`/products/${productId}`]);
  }
}
