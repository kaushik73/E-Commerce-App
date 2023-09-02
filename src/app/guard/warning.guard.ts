import { Injectable } from '@angular/core';
import { AddProductComponent } from '../admin/components/add-product/add-product.component';

@Injectable({
  providedIn: 'root',
})
export class WarningGuard {
  canDeactivate(component: AddProductComponent): boolean {
    if (component.addProductForm.dirty) {
      if (confirm('Your are Navigating to Another Page')) {
        return true;
      } else {
        return false;
      }
    }
    return true;
  }
}
