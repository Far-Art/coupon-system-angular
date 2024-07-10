import {Component, forwardRef} from '@angular/core';
import {AbstractFormInputComponent} from '../abstract-form-input.component';
import {NG_VALUE_ACCESSOR} from '@angular/forms';


@Component({
  selector: 'cs-form-input',
  templateUrl: '../abstract-form-input.component.html',
  styleUrls: ['./form-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputComponent),
      multi: true
    }
  ]
})
export class FormInputComponent extends AbstractFormInputComponent<any> {

}
