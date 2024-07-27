import {Component, ElementRef, HostListener} from '@angular/core';


@Component({
  templateUrl: './host.component.html'
})
export abstract class HostComponent {

  protected constructor(protected selfRef: ElementRef<HTMLElement>) {}

  protected abstract onEscapeKey(event?: Event): void;

  protected abstract onHostFocus(event?: Event): void;

  protected abstract onHostClick(event?: Event): void;

  @HostListener('keydown.enter', ['$event'])
  @HostListener('keydown.space', ['$event'])
  private _onKeydownClick(): void {
    if (this.selfRef) {
      // prevent double click if element has focus
      if (document.hasFocus() && document.activeElement === this.selfRef.nativeElement) {
        return;
      }
      this.selfRef.nativeElement.click();
    }
  }

  @HostListener('click', ['$event'])
  private _onHostClick(event: Event): void {
    this.onHostClick(event);
  }

  @HostListener('focus', ['$event'])
  private _onHostFocus(event: Event): void {
    this.onHostFocus(event);
  }

  @HostListener('keydown.escape', ['$event'])
  private _onEscape(event: Event): void {
    this.onEscapeKey(event);
  }

}
