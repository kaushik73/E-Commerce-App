import { Component, EventEmitter, Output } from '@angular/core';
import { map } from 'rxjs';
import { AdminService } from 'src/app/admin/services/admin.service';
import { CategoryModel } from 'src/app/models/CategoryModel';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-category-navbar',
  templateUrl: './category-navbar.component.html',
  styleUrls: ['./category-navbar.component.css'],
})
export class CategoryNavbarComponent {
  public categories: CategoryModel[] = [];
  public sortingType: string = 'none';
  public categoryType: string = '';
  public categoryLoading: boolean = true;
  public selectedCategory!: string;
  public showSubcategories: boolean = false;
  @Output() filterName = new EventEmitter<any>();
  @Output() selectedCategoryName = new EventEmitter<any>();
  constructor(
    private adminService: AdminService,
    private sharedService: SharedService
  ) {}
  ngOnInit() {
    this.getCategories();
  }
  public getCategories() {
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
      .subscribe(() => {
        this.categoryLoading = false;
      });
  }
  public onSelectCategory(category: any): void {
    this.selectedCategory = category;
    this.categoryType = category;
    this.showSubcategories = true;
  }
  public onSelectSubCategory(subCategory: any): void {
    this.categoryType = subCategory;
  }
  public onMouseLeave(): void {
    this.showSubcategories = false;
  }
  public sendFilterNameToParent(sortingType: string): void {
    this.filterName.emit(sortingType);
  }
  public sendCategoryNameToParent(selectedCategoryName: string): void {
    this.sharedService.searchItem.next('');
    this.selectedCategoryName.emit(selectedCategoryName);
  }
}
