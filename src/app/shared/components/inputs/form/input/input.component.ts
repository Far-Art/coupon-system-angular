import {Component, forwardRef} from '@angular/core';
import {AbstractFormInputComponent} from '../abstract-form-input.component';
import {NG_VALUE_ACCESSOR} from '@angular/forms';


@Component({
  selector: 'cs-input',
  templateUrl: '../abstract-form-input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent extends AbstractFormInputComponent<any> {
  protected override onHostClick(): void {}

  protected override onHostFocus(): void {}
}
