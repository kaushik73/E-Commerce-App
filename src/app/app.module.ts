import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { MainNavbarComponent } from './components/main-navbar/main-navbar.component';
import { ProductsComponent } from './components/products/products.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CategoryNavbarComponent } from './components/category-navbar/category-navbar.component';
import { CartComponent } from './components/cart/cart.component';
import { FiltersPipe } from './pipes/filters.pipe';
import { FormsModule } from '@angular/forms';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { NgToastModule } from 'ng-angular-popup';
import firebaseKey from '../../src/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { SortingPipe } from './pipes/sorting.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
@NgModule({
  declarations: [
    AppComponent,
    MainNavbarComponent,
    ProductsComponent,
    ProductDetailComponent,
    CategoryNavbarComponent,
    CartComponent,
    FiltersPipe,
    WishlistComponent,
    PageNotFoundComponent,
    SortingPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    FormsModule,
    NgToastModule,
    AngularFireModule.initializeApp(firebaseKey),
    AngularFireStorageModule,
    NgxPaginationModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
