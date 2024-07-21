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

  @ContentChildren(OptionComponent) protected _optionsQueryList: QueryList<OptionComponent>;
  @ViewChild(OptionComponent) protected _emptyOption: OptionComponent;

  @Input() showEmptyOption = false;
  @Input('selected') selectedIndex: number;

  protected isOpen = false;
  protected _options: OptionComponent[] = [];
  protected selected: OptionComponent;

  onOpen() {
    this.isOpen = !this.isOpen;
  }

  onOptionSelect(index: number) {
    this.selected = this._options[index];
    this.selectedIndex = index;
    this.setValue(this.selected.value);
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  override ngOnChanges() {
    super.ngOnChanges();
  }

  override ngAfterContentInit() {
    super.ngAfterContentInit();
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

    this.changeDetector.detectChanges();
  }

}
