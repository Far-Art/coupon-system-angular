import {
  Component,
  forwardRef,
  Input
} from '@angular/core';
import {
  IdGeneratorService
} from '../../services/id-generator.service';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';


@Component({
  selector: 'cs-form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputComponent),
      multi: true
    }
  ]
})
export class FormInputComponent implements ControlValueAccessor {

  @Input() id: string = this.idGenerator.generate();

  @Input() placeholder: string = 'input';

  @Input() type: 'text' | 'textarea' | 'number' | 'currency' | 'date' = 'text';

  value: any;

  onChange: any  = () => {};
  onTouched: any = () => {};

  constructor(private idGenerator: IdGeneratorService) {}

  setValue(value: any) {
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  handleInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value  = input.value;
    this.onChange(this.value);
    this.onTouched();
  }

}
