import {ChangeDetectionStrategy, Component, ElementRef, forwardRef, Input, OnInit, ViewChild} from '@angular/core';
import {AbstractFormInputComponent} from '../abstract-form-input.component';
import {NG_VALUE_ACCESSOR} from '@angular/forms';


@Component({
  selector: 'cs-wheel-picker',
  templateUrl: './wheel-picker.component.html',
  styleUrls: ['./wheel-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WheelPickerComponent),
      multi: true
    }
  ]
})
export class WheelPickerComponent extends AbstractFormInputComponent<number | string | Date> implements OnInit {

  @ViewChild('wheel', {static: true}) private wheel: ElementRef<HTMLDivElement>;

  private selectFieldHeight = 25 + 10; // height + margin

  private scrollEnded: boolean = true;
  private scrollTimeout: any;
  private scrollEndTimeout: any;

  @Input() values: number[] | string[] | Date[] = [];
  @Input() range: { start: number | Date, end: number | Date };
  selectedIndex                                 = 0;

  override ngOnInit(): void {
    super.ngOnInit();
    if (this.values?.length === 0 && this.range?.start != null && this.range?.end != null) {
      if (typeof this.range.start === 'number' && typeof this.range.end === 'number') {
        let i       = this.range.start;
        this.values = Array.from({length: this.range.end + 1 - this.range.start}).map(v => i++);
      }
    }

    const idx = this.values.findIndex((v: any) => v === this.control.value);
    if (idx >= 0) {
      this.selectedIndex = idx;
      this.setValue(this.values[this.selectedIndex]);
      // this.wheel.nativeElement.scroll({top: this.selectedIndex * this.selectFieldHeight, behavior: 'smooth'});
      // this.renderer.setStyle(this.wheel.nativeElement, 'transform', `translateY(-${this.selectedIndex * this.selectFieldHeight}px)`);
    }
  }

  onWheel(event: WheelEvent) {
    this.preventDefault(event);
    this.calcSelectedIndex(event);
    const offset = this.calcOffset(event);
    this.renderer.setStyle(this.wheel.nativeElement, 'transform', `translateY(-${offset}px)`);
  }

  onScroll(event: Event) {
    this.preventDefault(event);
    this.scrollEnded = false;
    if (this.scrollTimeout) clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
      this.scrollEnded = true;
    }, 150);
    this.calcSelectedIndex(event);
    this.onScrollEnd(event);
  }

  private onScrollEnd(event: Event) {
    if (this.scrollEndTimeout) clearTimeout(this.scrollEndTimeout);
    if (!this.scrollEnded) {
      this.scrollEndTimeout = setTimeout(() => {this.onScrollEnd(event)}, 50);
      return;
    }

    this.setValue(this.values[this.selectedIndex]);

    setTimeout(() => {
      const element: HTMLElement = event.target as HTMLElement;
      element.scroll({top: this.selectedIndex * this.selectFieldHeight, behavior: 'smooth'});
    }, 200);
  }

  private preventDefault(event: Event) {
    if (event.cancelable) {
      event.preventDefault();
    }
  }

  private calcSelectedIndex(event: Event) {
    if (event instanceof WheelEvent) {
      this.selectedIndex = (this.selectedIndex + (event.deltaY > 0 ? 1 : -1) + this.values.length) % this.values.length;
    } else {
      const scrollPos    = (event.target as HTMLElement).scrollTop;
      this.selectedIndex = Math.round(scrollPos / this.selectFieldHeight);
    }
  }

  private calcOffset(event: WheelEvent): number {
    if (event.deltaY < 0 && this.selectedIndex === this.values.length - 1) {
      return 0;
    } else if (event.deltaY > 0 && this.selectedIndex === 0) {
      return this.selectedIndex;
    }

    return this.selectFieldHeight * (this.selectedIndex % this.values.length);
  }

  protected override onHostClick(): void {}

}
