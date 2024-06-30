import {AfterContentInit, Directive, ElementRef} from '@angular/core';


@Directive({
  selector: '[csCheckNgContent]'
})
export class CheckNgContentDirective implements AfterContentInit {

  constructor(private el: ElementRef) {}

  ngAfterContentInit() {
    const content: HTMLElement = this.el.nativeElement;
    const hasContent           = content.innerHTML.trim().length > 0;

    if (hasContent) {
      content.classList.add('has-content');
      content.classList.remove('empty-content')
    } else {
      content.classList.add('empty-content');
      content.classList.remove('has-content')
    }
  }
}
