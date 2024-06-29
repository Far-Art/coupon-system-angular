import {
  Component,
  forwardRef,
  Input
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import {
  IdGeneratorService
} from '../../services/id-generator.service';


@Component({
  selector: 'cs-form-select',
  templateUrl: './form-select.component.html',
  styleUrls: ['./form-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormSelectComponent),
      multi: true
    }
  ]
})
export class FormSelectComponent implements ControlValueAccessor {
  @Input() id: string = this.idGenerator.generate();

  @Input() placeholder: string = 'select';

  @Input() type: string = 'text';

  @Input() options: string[] = [];

  value: string;

  onChange: any  = () => {};
  onTouched: any = () => {};

  constructor(private idGenerator: IdGeneratorService) {}

  setValue(value: string) {
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
