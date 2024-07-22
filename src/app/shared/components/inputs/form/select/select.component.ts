import {Component, ContentChildren, forwardRef, Input, QueryList, ViewChild} from '@angular/core';
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

  @Input() showEmptyOption = false;
  @Input('selected') selectedIndex: number;
  @ContentChildren(OptionComponent) protected _optionsQueryList: QueryList<OptionComponent>;
  @ViewChild(OptionComponent) protected _emptyOption: OptionComponent;
  protected isOpen = false;
  protected _options: OptionComponent[] = [];
  protected selected: OptionComponent;
  private eventUnsubscribe: () => void;

  onOpen() {
    this.isOpen = true;
    this.renderer.setStyle(this.elRef.nativeElement, 'z-index', '1050');
    this.eventUnsubscribe = this.renderer.listen(document.documentElement, 'click', () => this.onClose());
  }

  onClose() {
    setTimeout(() => {
      if (this.eventUnsubscribe) this.eventUnsubscribe();
      this.isOpen = false;
      this.renderer.removeStyle(this.elRef.nativeElement, 'z-index');
    })
  }

  onOptionSelect(index: number) {
    this.selected = this._options[index];
    // this._optionsQueryList.filter(o => o?.templateRef?.elementRef?.nativeElement != null).forEach(option => {
    //   this.renderer.removeClass(option.templateRef.elementRef.nativeElement, 'fa-option-selected');
    // });
    this.renderer.addClass(this.selected.templateRef.elementRef.nativeElement.parentElement, 'fa-option-selected')
    this.selectedIndex = index;
    this.onClose();
    this.setValue(this.selected.value);
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();
    if (this.showEmptyOption) {
      this._options.push(this._emptyOption);
    }
    this._options.push(...this._optionsQueryList);

    if (this.selectedIndex) {
      this.onOptionSelect(this.selectedIndex);
    }

    if (!this.selected && this._options.length > 0) {
      this.onOptionSelect(0);
    }
  }

}
