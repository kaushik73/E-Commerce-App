import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { WishlistService } from 'src/app/services/wishlist.service';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-main-navbar',
  templateUrl: './main-navbar.component.html',
  styleUrls: ['./main-navbar.component.css'],
})
export class MainNavbarComponent {
  public showSubNavbar: boolean = true;
  public isUserLogin: string = '0';
  public userName: string = '';
  public totalWishListItem: number = 0;
  public totalCartItem: number = 0;
  public isAdmin: string = '0';
  @ViewChild('searchForm') searchForm!: NgForm;
  constructor(
    private router: Router,
    private sharedService: SharedService,
    private cartService: CartService,
    private wishListService: WishlistService
  ) {}
  ngOnInit() {
    this.getNumberOfProductsFromCart();
    this.getNumberOfProductsFromWishList();
    this.loginUserButton();
    this.cartService.getAllOrders();
  }
  ngDoCheck() {
    this.isAdmin = localStorage.getItem('isAdmin') || '0';
  }
  public loginUserButton(): void {
    this.router.navigate(['auth/login']);
    this.sharedService.isUserLogin.subscribe(() => {
      this.isUserLogin = localStorage.getItem('isUserLogin') || '1';
    });
  }
  public logOutUser(): void {
    this.sharedService.setUserData('', '0', '');
    this.sharedService.isUserLogin.subscribe(() => {
      this.isUserLogin = localStorage.getItem('isUserLogin') || '0';
    });
    this.cartService.productList.next([]);
    this.cartService.cartItemList = [];
    this.wishListService.wishItemList = [];
    this.wishListService.wishProductList.next([]);
    localStorage.setItem('userHasPreviousCartItems', '0');
  }
  public searchBoxContent(searchItem: string): void {
    this.router.navigate(['/products']);
    this.sharedService.searchItem.next(searchItem);
    this.sharedService.searchItem.subscribe((searchBoxContent) => {
      if (searchBoxContent === '') {
        this.searchForm.reset();
      }
    });
  }
  private getNumberOfProductsFromCart(): void {
    this.cartService.getProducts().subscribe((items: any) => {
      this.totalCartItem = items.length;
    });
  }
  private getNumberOfProductsFromWishList(): void {
    this.wishListService.getWishlistProducts().subscribe((items: any) => {
      this.totalWishListItem = items.length;
    });
  }
  public showAllProducts(filterName: string): void {
    this.sharedService.searchItem.next(filterName);
  }
}
