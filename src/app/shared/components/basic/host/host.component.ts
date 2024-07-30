import {Component, ElementRef, HostListener} from '@angular/core';


@Component({
  templateUrl: './host.component.html'
})
export abstract class HostComponent {

  protected constructor(protected selfRef: ElementRef<HTMLElement>) {}

  protected abstract onHostClick(event: Event): void;

  protected abstract onHostFocus(event: Event): void;

  protected onEscapeClick(event: Event) {};

  protected onEnterClick(event: Event) {
    this.selfRef.nativeElement.click();
  }

  protected onSpaceClick(event: Event) {
    this.selfRef.nativeElement.click();
  }

  @HostListener('keydown.enter', ['$event'])
  private _onEnterClick(event: Event): void {
    if (this.selfRef) {
      this.onEnterClick(event);
    }
  }

  @HostListener('keydown.space', ['$event'])
  private _onSpaceClick(event: Event): void {
    if (this.selfRef) {
      this.onSpaceClick(event);
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
    this.onEscapeClick(event);
  }

}
