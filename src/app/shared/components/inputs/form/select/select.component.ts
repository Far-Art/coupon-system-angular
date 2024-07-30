import {Component, ContentChildren, ElementRef, forwardRef, Input, QueryList, ViewChild} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {AbstractFormInputComponent} from '../abstract-form-input.component';
import {OptionComponent} from './option/option.component';


@Component({
  selector: 'cs-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ]
})
export class SelectComponent extends AbstractFormInputComponent<any> {

  @Input('selected') selectedIndex: number;
  @ContentChildren(OptionComponent) protected _options: QueryList<OptionComponent>;
  @ViewChild('selectedOptionEl', {static: true}) selectedElement: ElementRef<HTMLDivElement>;
  protected isOpen = false;
  private onOutsideClickUnsubscribe: () => void;
  private escUnsubscribe: () => void;
  private focusUnsubscribe: () => void;
  private tabUnsubscribe: () => void;
  private shiftTabUnsubscribe: () => void;
  selected: OptionComponent;

  onOpen() {
    if (!this.isOpen && this._options.length) {
      setTimeout(() => this.isOpen = true);
      this.renderer.setStyle(this.elRef.nativeElement, 'z-index', '1050');

      setTimeout(() => {
        if (this.selected) {
          this.selected['selfRef'].nativeElement.focus();
        } else {
          this._options.get(this.selectedIndex || 0)['selfRef'].nativeElement.focus();
        }
      });
      this.onFocusCycleListener();
      this.onOutsideClickUnsubscribe = this.renderer.listen(window, 'click', () => this.onClose());
    }
  }

  onClose(setFocus = true) {
    if (this.isOpen) {
      setTimeout(() => this.isOpen = false);
      this.renderer.removeStyle(this.elRef.nativeElement, 'z-index');
      if (this.onOutsideClickUnsubscribe) this.onOutsideClickUnsubscribe();
      if (this.escUnsubscribe) this.escUnsubscribe();
      if (this.focusUnsubscribe) this.focusUnsubscribe();
      if (this.tabUnsubscribe) this.tabUnsubscribe();
      if (this.shiftTabUnsubscribe) this.shiftTabUnsubscribe();
      if (setFocus) setTimeout(() => this.selectedElement.nativeElement.focus());
    }
  }

  onOptionSelect(option: OptionComponent, setFocus = true) {
    this.selected = option;
    this.setValue(option.value);
    this.onClose(setFocus);
    this._options.forEach(opt => {
      const elRef = opt['selfRef'].nativeElement;
      if (opt === this.selected) {
        this.renderer.addClass(elRef, 'active');
        this.renderer.setAttribute(elRef, 'aria-selected', 'true');
      } else {
        this.renderer.removeClass(elRef, 'active');
        this.renderer.removeAttribute(elRef, 'aria-selected');
      }
    })
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();

    if (this.selectedIndex) {
      this.onOptionSelect(this._options.get(this.selectedIndex), false);
    }

    if (!this.selected && this._options) {
      this.onOptionSelect(this._options.get(0), false);
    }
  }

  protected override onHostClick(): void {
    this.isOpen ? this.onClose() : this.onOpen();
  }

  private onFocusCycleListener() {
    this.focusUnsubscribe = this.renderer.listen(window, 'keydown', (event: KeyboardEvent) => {

      if (this.shiftTabUnsubscribe) this.shiftTabUnsubscribe();
      this.shiftTabUnsubscribe = this.renderer.listen(this._options.first['selfRef'].nativeElement, 'focusout', () => {
        if (event.shiftKey && event.key === 'Tab') {
          this._options.last['selfRef'].nativeElement.focus();
        }
      });

      if (this.tabUnsubscribe) this.tabUnsubscribe();
      this.tabUnsubscribe = this.renderer.listen(this._options.last['selfRef'].nativeElement, 'focusout', () => {
        if (!event.shiftKey && event.key === 'Tab') {
          this._options.first['selfRef'].nativeElement.focus();
        }
      });
    });
  }

  protected override onEscapeClick(): void {
    if (this.isOpen) {
      this.onClose();
    } else {
      this.selectedElement.nativeElement.blur();
    }
  }
}
