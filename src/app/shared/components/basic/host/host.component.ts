import {Component, ElementRef, HostListener} from '@angular/core';


@Component({
  templateUrl: './host.component.html'
})
export abstract class HostComponent {

  protected constructor(protected selfRef: ElementRef<HTMLElement>) {}

  @HostListener('keydown.enter', ['$event'])
  @HostListener('keydown.space', ['$event'])
  private _onKeydownClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.selfRef) {
      this.selfRef.nativeElement.click();
    }
  }

  @HostListener('click', ['$event'])
  private _onHostClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.onHostClick(event);
  }

  @HostListener('focus', ['$event'])
  private _onHostFocus(event: Event): void {
    this.onHostFocus(event);
  }

  protected abstract onHostFocus(event?: Event): void;

  protected abstract onHostClick(event?: Event): void;

}
