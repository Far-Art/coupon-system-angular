import {Directive, ElementRef} from '@angular/core';


@Directive({
  selector: '[headerContent]'
})
export class HeaderContentDirective {

  constructor(private elRef: ElementRef) {
    const elem: HTMLElement = this.elRef.nativeElement;
    elem.setAttribute('name', 'headerContentRef');
    elem.classList.add('header-content');
  }

}
