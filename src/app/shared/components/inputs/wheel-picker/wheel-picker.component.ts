import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';


@Component({
  selector: 'cs-wheel-picker',
  templateUrl: './wheel-picker.component.html',
  styleUrls: ['./wheel-picker.component.scss']
})
export class WheelPickerComponent {

  @ViewChild('wheel', {static: true}) wheel: ElementRef<HTMLDivElement>;

  private selectFieldHeight = 30 + 10; // height + margin

  scrollPos;

  values        = Array.from({length: 50}, (_, i) => String(i).padStart(2, '0'));
  selectedIndex = 0;

  constructor(private renderer: Renderer2) {}

  onWheel(event: WheelEvent) {
    event.preventDefault();
    event.stopPropagation();
    const offset = this.calcOffset(event);
    this.renderer.setStyle(this.wheel.nativeElement, 'transform', `translateY(-${offset}px)`);
  }

  onScroll(event: Event) {
    event.preventDefault();
    this.selectedIndex = this.calcSelected(event);
    this.scrollPos = this.selectedIndex;

    window.scrollTo(0,0);
    // this.renderer.setStyle(this.wheel.nativeElement, 'transform', `translateY(-${13 * this.selectedIndex}px)`);
  }

  onScrollEnd(event: Event) {
    event.preventDefault();
    const element: HTMLElement = event.target as HTMLElement;
    const selected             = this.calcSelected(event);
    element.scroll({top: selected * this.selectFieldHeight, behavior: 'smooth'});
  }

  // TODO 1 index above is rotateX(-50deg) translateY(16px)
  private calcSelected(event: Event) {
    const scrollPos = (event.target as HTMLElement).scrollTop;
    return Math.round(scrollPos / this.selectFieldHeight);
  }

  save() {
    // console.log(`Selected Time: ${this.hours[this.hoursIndex]}:${this.minutes[this.minutesIndex]}`);
  }

  getTransform(index: number): string {
    // const angle = (360 / this.values.length) * (index - this.selectedIndex);
    // const angle = (index - this.selectedIndex) * 33;
    // return `rotateX(${angle}deg) translateY(${angle / 2}px)`;
    return null;
  }

  private calcOffset(event: WheelEvent): number {
    this.selectedIndex = (this.selectedIndex + (event.deltaY > 0 ? 1 : -1) + this.values.length) % this.values.length;
    if (event.deltaY < 0 && this.selectedIndex === this.values.length - 1) {
      return 0;
    } else if (event.deltaY > 0 && this.selectedIndex === 0) {
      return this.selectedIndex;
    }

    return this.selectFieldHeight * (this.selectedIndex % this.values.length);
  }
}
