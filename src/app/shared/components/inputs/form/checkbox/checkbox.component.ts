import {Component, forwardRef} from '@angular/core';
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

  override ngOnInit() {
    this.type = 'checkbox';
    this._type = this.type;
    super.ngOnInit();
  }

}
