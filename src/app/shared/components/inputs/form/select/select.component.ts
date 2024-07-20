import {Component, ContentChildren, ElementRef, forwardRef, Input, QueryList, TemplateRef, ViewChild} from '@angular/core';
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

  @Input() showEmptyOption = true;

  protected isOpen = false;
  protected _options: OptionComponent[] = [];
  protected selected: OptionComponent;

  onOpen() {
    this.isOpen = !this.isOpen;
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
    if (!this.selected) {
      this.selected = this._options.length > 0 ? this._options[0] : null;
      this.changeDetector.detectChanges();
    }
  }

}
