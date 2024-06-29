import {AfterContentInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, OnInit} from '@angular/core';
import {ControlValueAccessor} from '@angular/forms';
import {IdGeneratorService} from '../../services/id-generator.service';


export interface FormErrorParams<T> {
  evaluate: (value: T) => boolean,
  message: string
}

@Component({
  templateUrl: './abstract-form-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AbstractFormInputComponent<T> implements OnInit, OnChanges, ControlValueAccessor, AfterContentInit {

  @Input() id: string = this.idGenerator.generate();

  @Input() placeholder: string = 'input';

  @Input() type: 'text' | 'textarea' | 'number' | 'currency' | 'date' = 'text';

  @Input() options: T[] = [];

  @Input() errors: FormErrorParams<T> | FormErrorParams<T>[];

  value: T;

  isTouched: boolean;
  isPristine: boolean;
  isValid: boolean;

  nodeName: string;

  errorMessages: string[] = [];

  onChange: any  = () => {};
  onTouched: any = () => {};

  constructor(
      private idGenerator: IdGeneratorService,
      private elRef: ElementRef<HTMLElement>
  ) {}

  setValue(value: T) {
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }

  handleInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value  = input.value as T;

    this.handleErrors();

    this.onChange(this.value);
    this.onTouched();
  }

  writeValue(value: T): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
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

  ngOnInit(): void {
    this.nodeName = this.elRef.nativeElement.nodeName;
  }

  private handleErrors() {
    this.errorMessages.length = 0;
    if (this.errors && this.isTouched) {
      if (this.errors instanceof Array) {
        this.errors.forEach(error => {
          if (error.evaluate(this.value)) {
            this.errorMessages.push(error.message);
          }
        });
      } else {
        if (this.errors.evaluate(this.value)) {
          this.errorMessages.push(this.errors.message);
        }
      }
    }
  }

  ngOnChanges(): void {
    this.handleErrors();
  }

}
