import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductModel } from 'src/app/models/Productmodel';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-show-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css'],
})
export class ViewProductComponent {
  private productId: string | null = '';
  public productDetail!: ProductModel;
  constructor(
    private productFirebase: ProductService,
    private activatedRoute: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.getProductId();
    this.getProductDetail();
  }
  private getProductId(): void {
    this.activatedRoute.paramMap.subscribe((browserUrl) => {
      this.productId = browserUrl.get('id');
    });
  }
  public getProductDetail(): void {
    this.productFirebase
      .getSingleProduct(this.productId as string)
      .subscribe((productDetail: any) => {
        this.productDetail = productDetail;
      });
  }
}
