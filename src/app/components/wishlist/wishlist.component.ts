import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductModel } from 'src/app/models/Productmodel';
import { CartService } from 'src/app/services/cart.service';
import { WishlistService } from 'src/app/services/wishlist.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
})
export class WishlistComponent {
  public products: ProductModel[] = [];
  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.wishlistService.getWishlistProducts().subscribe((products: any) => {
      this.products = products;
    });
  }
  public removeItem(product: ProductModel): void {
    this.wishlistService.removeWishListItem(product);
  }
  public addProductToCart(product: ProductModel): void {
    this.removeItem(product);
    this.cartService.addtoCart(product);
  }
  public emptyWishlist(): void {
    this.wishlistService.removeAllWishlistItem();
  }
  public showProductDetail(productId: number) {
    this.router.navigate([`/products/${productId}`]);
  }
}
