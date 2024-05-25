import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[unfocus]'
})
export class UnfocusDirective {

  constructor(private elRef: ElementRef) {}

  @HostListener('focus') onFocus() {
    this.elRef.nativeElement.blur();
  }

}
