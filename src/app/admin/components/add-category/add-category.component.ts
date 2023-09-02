import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { map } from 'rxjs';
import { timer } from 'rxjs';
import { CategoryModel } from 'src/app/models/CategoryModel';
import { ProductModel } from 'src/app/models/Productmodel';
import { ProductService } from 'src/app/services/product.service';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css'],
})
export class AddCategoryComponent {
  public categories: any[] = [];
  private allProducts: ProductModel[] = [];
  public addCategoryForm!: FormGroup;
  public currentCategory: CategoryModel[] = [];
  public currentSubCategory: CategoryModel[] = [];
  public selectedCategory!: string;
  public selectedCategoryForSubCategory!: string;
  public addSubCategoryForm!: any;
  public previousCategoryName!: string;
  public previousSubCategoryName!: string;
  public categoryId!: string;
  public showAddCategoryMessage!: boolean;
  public showCategoryUpdateMessage!: boolean;
  public showSubCategoryUpdateMessage!: boolean;
  public editCategoryMode: boolean = false;
  public editSubCategoryMode: boolean = false;
  public loading: boolean = true;
  public categoryData!: CategoryModel;
  public subCategoryArray: any[] = [];
  constructor(
    private adminService: AdminService,
    private formBuilder: FormBuilder,
    private productService: ProductService
  ) {}
  ngOnInit(): void {
    this.createAddCategoryForm();
    this.createAddSubCategoryForm();
    this.getCategories();
  }
  private createAddCategoryForm(): void {
    this.addCategoryForm = this.formBuilder.group({
      category: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
    });
  }
  private createAddSubCategoryForm(): void {
    this.addSubCategoryForm = this.formBuilder.group({
      category: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      subCategory: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
    });
  }
  public getCategories(): any {
    return this.adminService
      .getCategories()
      .pipe(
        map((product: any) => {
          const categories = [];
          for (const key in product) {
            categories.push({ ...product[key], id: key });
          }
          return categories;
        })
      )
      .subscribe((categories) => {
        this.loading = false;
        this.categories = categories;
      });
  }
  public sendCategoryDataToForm(
    categoryName: string,
    categoryId: string
  ): void {
    this.addCategoryForm.setValue({ category: categoryName });
    this.categoryId = categoryId;
    this.editCategoryMode = true;
    this.previousCategoryName = categoryName;
  }
  public sendSubCategoryDataToForm(
    categoryName: string,
    subCategoryName: string,
    categoryId: string
  ): void {
    this.addSubCategoryForm.setValue({
      category: categoryName,
      subCategory: subCategoryName,
    });
    this.categoryId = categoryId;
    this.editSubCategoryMode = true;
    this.selectedCategoryForSubCategory = categoryName;
    this.previousSubCategoryName = subCategoryName;
  }
  public addCategory(): void {
    this.adminService.addCategory(this.addCategoryForm.value).subscribe();
    this.showAddCategoryMessage = true;
    timer(1500).subscribe(() => {
      this.showAddCategoryMessage = false;
      this.getCategories();
      this.addCategoryForm.reset();
    });
  }
  public updateCategory(): void {
    this.selectedCategory = this.addCategoryForm.value.category;
    this.currentCategory = this.categories.filter(
      (category) => category.category === this.previousCategoryName
    );
    if (this.currentCategory[0].hasOwnProperty('subCategory')) {
      this.categoryData = {
        category: this.selectedCategory,
        subCategory: this.currentCategory[0].subCategory,
      };
    } else {
      this.categoryData = {
        category: this.selectedCategory,
        subCategory: [],
      };
    }
    this.adminService
      .updateCategory(this.currentCategory[0]?.id, this.categoryData)
      .subscribe();
    this.showCategoryUpdateMessage = true;
    timer(2000).subscribe(() => {
      this.showCategoryUpdateMessage = false;
    });
    this.getCategories();
    this.updateCategoryOfAllProducts();
  }
  public addSubCategory(): void {
    this.currentCategory = this.categories.filter(
      (category) => category.category === this.selectedCategory
    );
    if (this.currentCategory[0].hasOwnProperty('subCategory')) {
      let newSubCategory: any[] = this.currentCategory[0].subCategory;
      newSubCategory?.push(this.addSubCategoryForm.value.subCategory);
      this.categoryData = {
        category: this.selectedCategory,
        subCategory: newSubCategory,
      };
    } else {
      this.categoryData = {
        category: this.selectedCategory,
        subCategory: [this.addSubCategoryForm.value.subCategory],
      };
    }
    this.adminService.addSubCategory(
      this.currentCategory[0]?.id as string,
      this.categoryData
    );
    this.showSubCategoryUpdateMessage = true;
    timer(2000).subscribe(() => {
      this.showSubCategoryUpdateMessage = false;
    });
    this.getCategories();
  }
  public updateSubCategory(): void {
    this.currentSubCategory = this.categories.filter((category) => {
      return category.category == this.selectedCategoryForSubCategory;
    });
    let subCategoryIndex: any = this.currentSubCategory[0].subCategory.indexOf(
      this.previousSubCategoryName
    );
    this.subCategoryArray = this.currentSubCategory[0].subCategory;
    this.subCategoryArray[subCategoryIndex] =
      this.addSubCategoryForm.value.subCategory;
    this.categoryData = {
      category: this.selectedCategory,
      subCategory: this.subCategoryArray,
    };
    this.adminService.addSubCategory(
      this.currentSubCategory[0]?.id as string,
      this.categoryData
    );

    this.editSubCategoryMode = true;
    this.showSubCategoryUpdateMessage = true;
    timer(2000).subscribe(() => {
      this.showSubCategoryUpdateMessage = false;
    });
    this.getCategories();
  }
  private updateCategoryOfAllProducts(): void {
    this.productService
      .getProducts()
      .pipe(
        map((product: any) => {
          const products = [];
          for (const key in product) {
            products.push({ ...product[key], id: key });
          }
          this.allProducts = products;
        })
      )
      .subscribe(() => {
        let productsWithSameCategory: any[] = [];
        productsWithSameCategory = this.allProducts.filter(
          (product: ProductModel) => {
            return product.category.includes(this.previousCategoryName);
          }
        );
        for (let i in productsWithSameCategory) {
          productsWithSameCategory[i].category = this.selectedCategory;
          this.adminService
            .updateProduct(
              productsWithSameCategory[i].id.toString(),
              productsWithSameCategory[i]
            )
            .subscribe();
        }
      });
  }
}
