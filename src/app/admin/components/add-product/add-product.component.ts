import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { UserModel } from 'src/app/models/UserModel';
import { ProductService } from 'src/app/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { AdminService } from '../../services/admin.service';
import { CategoryModel } from 'src/app/models/CategoryModel';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { NgToastService } from 'ng-angular-popup';
import { ProductModel } from 'src/app/models/Productmodel';
import { timer } from 'rxjs';
@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent {
  public showMessage: boolean = false;
  public registerUserForm!: NgForm;
  public UserObject!: UserModel;
  private productId: string = '';
  public productDetail!: ProductModel;
  public selectedCategory: string = '';
  public selectedSubCategory: string = '';
  public addProductForm!: FormGroup;
  public categories: CategoryModel[] = [];
  public editProductMode: boolean = false;
  public allDataCame: boolean = false;
  public imageUploading: boolean = false;
  public productThumbnail!: string;
  public currentCategory!: any;
  public filteredSubcategory!: string;
  public URL: string = '';
  public imageURL: string = '';
  constructor(
    private productService: ProductService,
    private adminService: AdminService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private angularFireStorage: AngularFireStorage,
    private toaster: NgToastService
  ) {}
  ngOnInit(): void {
    this.createProductForm();
    this.getCategories();
    this.editFormMode();
    this.getProductId();
    this.getProductDetail();
  }
  private createProductForm(): void {
    this.addProductForm = this.formBuilder.group({
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
      ]),
      brand: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),

      category: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      subCategory: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      price: new FormControl('', [Validators.required, Validators.min(1)]),
      rating: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.max(5),
        Validators.min(0),
      ]),
      thumbnail: new FormControl(''),
      temporaryThumbnail: new FormControl(''),
      images: new FormControl(''),
    });
  }
  public async onThumbnailUpload(event: any) {
    this.imageUploading = true;
    const file = event.target.files[0];
    if (file) {
      const path = `${file.name}`;
      const upload = await this.angularFireStorage.upload(path, file);
      this.URL = await upload.ref.getDownloadURL();
      if (this.URL !== '') {
        this.allDataCame = true;
        this.imageUploading = false;
      }
    }
  }
  public addProduct(): void {
    this.addProductForm.value.thumbnail = this.URL;
    const title = this.addProductForm.value.title;
    this.showMessage = true;
    this.productService.sendProduct(this.addProductForm.value).subscribe(() =>
      this.toaster.success({
        detail: 'Product : ' + title,
        summary: 'added successfully',
        duration: 2000,
      })
    );
    this.addProductForm.reset();
  }
  private getProductId(): void {
    this.activatedRoute.queryParams.subscribe((queryId) => {
      this.productId = queryId['id'];
    });
  }
  private getProductDetail(): void {
    this.productService
      .getSingleProduct(this.productId)
      .subscribe((productDetail: any) => {
        this.productDetail = productDetail;
        this.assignProductValuesToForm();
      });
  }
  private assignProductValuesToForm(): void {
    this.productThumbnail = this.productDetail.thumbnail;
    this.addProductForm.patchValue({
      title: this.productDetail.title,
      description: this.productDetail.description,
      brand: this.productDetail.brand,
      category: this.productDetail.category,
      price: this.productDetail.price,
      rating: this.productDetail.rating,
      images: this.productDetail.images,
    });
    this.currentCategory = this.productDetail.category;
    this.imageURL = this.productDetail.thumbnail;
    timer(500).subscribe(() => {
      this.getSelectedSubCategories();
    });
    this.addProductForm.patchValue({
      thumbnail: '',
      temporaryThumbnail: this.productDetail.thumbnail,
      subCategory: this.productDetail.subCategory,
    });
  }
  public editFormMode(): void {
    this.adminService.editProductMode.subscribe((mode) => {
      this.editProductMode = mode;
      if (mode == false) {
        this.addProductForm.reset();
      }
    });
  }
  public updateProduct(): void {
    if (this.addProductForm.value.thumbnail === '') {
      this.addProductForm.value.thumbnail =
        this.addProductForm.value.temporaryThumbnail;
      this.adminService
        .updateProduct(this.productId, this.addProductForm.value)
        .subscribe(() =>
          this.toaster.success({
            detail: 'Product : ' + this.addProductForm.value.title,
            summary: 'updated successfully',
            duration: 2000,
          })
        );
    } else {
      this.addProductForm.value.thumbnail = this.URL;
      this.adminService
        .updateProduct(this.productId, this.addProductForm.value)
        .subscribe(() =>
          this.toaster.success({
            detail: 'Product : ' + this.addProductForm.value.title,
            summary: 'updated successfully',
            duration: 2000,
          })
        );
    }
    this.showMessage = true;
  }
  private getCategories(): void {
    this.adminService
      .getCategories()
      .pipe(
        map((product: any) => {
          const categories = [];
          for (const key in product) {
            categories.push({ ...product[key], id: key });
          }
          this.categories = categories;
        })
      )
      .subscribe();
  }
  public getSelectedSubCategories(): void {
    this.getCategories();
    this.currentCategory = this.categories.filter(
      (category: CategoryModel) => category.category === this.selectedCategory
    );
    this.filteredSubcategory = this.currentCategory[0].subCategory;
  }
  ngOnDestroy(): void {
    this.adminService.editProductMode.next(false);
  }
}
