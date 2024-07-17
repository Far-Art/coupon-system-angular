import {Component, ElementRef, HostListener} from '@angular/core';


@Component({
  templateUrl: './host.component.html'
})
export abstract class HostComponent {

  protected constructor(private self: ElementRef<HTMLElement>) {}

  @HostListener('keydown.enter', ['$event'])
  @HostListener('keydown.space', ['$event'])
  private onKeydownClick(event: Event): void {
    event.preventDefault();
    if (this.self) {
      this.self.nativeElement.click();
    }
  }

  @HostListener('click', ['$event'])
  private _onHostClick(event: Event): void {
    event?.stopPropagation();
    this.onHostClick(event);
  }

  abstract onHostClick(event: Event): void;

}
