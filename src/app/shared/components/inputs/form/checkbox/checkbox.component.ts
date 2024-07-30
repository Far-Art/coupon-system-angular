import {Component, ElementRef, forwardRef, Input, ViewChild} from '@angular/core';
import {AbstractFormInputComponent} from '../abstract-form-input.component';
import {NG_VALUE_ACCESSOR} from '@angular/forms';


@Component({
  selector: 'cs-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    }
  ]
})
export class CheckboxComponent extends AbstractFormInputComponent<boolean> {
  @Input() indeterminate = false;
  @Input() checked: boolean;
  @ViewChild('checkbox', {static: true}) checkbox: ElementRef<HTMLInputElement>;

  override ngOnInit() {
    this.type = 'checkbox';
    this._type = this.type;
    super.ngOnInit();
  }

  override ngOnChanges() {
    super.ngOnChanges();
    if (this.checked != null) {
      this.setValue(this.checked)
    }
    this.setIndeterminate();
  }

  private setIndeterminate() {
    this.checkbox.nativeElement.indeterminate = this.indeterminate;
  }

  protected override onHostClick() {
    if (!this.isDisabled) {
      this.setValue(!this.value);
    }
  }

  protected override onHostFocus(): void {}

  protected override onEscapeClick(): void {}
}
