import {
  AfterContentInit,
  Component,
  ElementRef,
  forwardRef,
  Input,
  OnInit
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import {
  IdGeneratorService
} from '../../services/id-generator.service';


@Component({
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => T),
      multi: true
    }
  ]
})
export abstract class AbstractFormInputComponent<T> implements ControlValueAccessor, OnInit, AfterContentInit {

  @Input() id: string = this.idGenerator.generate();

  @Input() placeholder: string = 'input';

  @Input() type: 'text' | 'textarea' | 'number' | 'currency' | 'date' = 'text';

  value: any;

  isTouched: boolean;
  isPristine: boolean;
  isValid: boolean;

  onChange: any  = () => {};
  onTouched: any = () => {};

  constructor(
      private idGenerator: IdGeneratorService,
      private elRef: ElementRef<HTMLElement>
  ) {}

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

  ngAfterContentInit(): void {
    const classObserver = new MutationObserver((mutations: MutationRecord[]) => {
      mutations.forEach(() => {
        // this is called twice because the old class is removed and the new added
        this.isValid    = this.elRef.nativeElement.classList.contains('ng-valid');
        this.isTouched  = this.elRef.nativeElement.classList.contains('ng-touched');
        this.isPristine = this.elRef.nativeElement.classList.contains('ng-pristine');
      });
    });

    classObserver.observe(this.elRef.nativeElement, {
      attributeFilter: ['class']
    });
  }

  ngOnInit(): void {}
}
