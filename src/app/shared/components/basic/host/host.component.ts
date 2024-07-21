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
    if (this.selfRef) {
      this.selfRef.nativeElement.click();
    }
  }

  @HostListener('click', ['$event'])
  private _onHostClick(event: Event): void {
    event?.stopPropagation();
    this.onHostClick(event);
  }

  protected abstract onHostClick(event?: Event): void;

}
