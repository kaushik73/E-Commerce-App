import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appAddMargin]',
})
export class AddMarginDirective {
  constructor(private el: ElementRef) {
    this.el.nativeElement.style.marginLeft = '160px';
  }
}
