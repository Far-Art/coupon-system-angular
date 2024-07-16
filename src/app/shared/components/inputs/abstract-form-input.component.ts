import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostBinding, Input, OnChanges, OnDestroy, OnInit, Optional, ViewChild} from '@angular/core';
import {AbstractControl, ControlValueAccessor, FormGroup, FormGroupDirective, FormGroupName, Validators} from '@angular/forms';
import {IdGeneratorService} from '../../services/id-generator.service';
import {Subscription} from 'rxjs';


export interface FormErrorParams<T> {
  evaluate: (value: T) => boolean,
  message: string
}

@Component({
  templateUrl: './abstract-form-input.component.html'
})
export class AbstractFormInputComponent<T> implements OnInit, OnChanges, AfterViewInit, ControlValueAccessor, OnDestroy {

  @ViewChild('content', {static: true}) content: ElementRef<HTMLDivElement>;

  @Input() id: string = this.idGenerator.generate();

  @Input() placeholder: string = 'input';

  @Input() type: 'text' | 'textarea' | 'number' | 'currency' | 'date' | 'email' | 'password' | 'button' | 'checkbox' | 'radio' | 'range' | 'image' | 'search' = 'text';

  @Input() options: T[] = [];

  @Input() errors: FormErrorParams<T> | FormErrorParams<T>[];

  @HostBinding('style.width') width = '100%';

  value: T;
  _type: string;

  form: FormGroup;
  isTouched: boolean;
  isPristine: boolean;
  isValid: boolean;
  isRequired: boolean;
  hasContent: boolean = true;

  nodeName: string;
  formControlName: string;
  control: AbstractControl<any, any>;
  dayOfWeek: number;

  errorMessages: string[] = [];

  private subscription: Subscription;

  constructor(
      protected idGenerator: IdGeneratorService,
      protected changeDetection: ChangeDetectorRef,
      protected elRef: ElementRef<HTMLElement>,
      @Optional() protected rootForm: FormGroupDirective,
      @Optional() protected formGroup: FormGroupName
  ) {}

  onChange: any  = () => {};

  onTouched: any = () => {};

  ngOnInit(): void {
    this.setType();
    this.form            = this.rootForm.form;
    this.nodeName        = this.elRef.nativeElement.nodeName;
    this.formControlName = this.elRef.nativeElement.getAttribute('formcontrolname');
    this.control         = this.form?.get(this.formGroup ? `${this.formGroup.name}` : this.formControlName);

    if (this.formGroup && this.control) {
      this.control = this.control.get(this.formControlName);
    }

    this.setDayOfWeek();
    if (this.control) {
      this.handleValueChanges();
      this.subscription = this.control.valueChanges.subscribe(() => this.handleValueChanges());
    }

  }

  ngOnChanges(): void {
    // this.handleErrors();
  }

  onBlur() {
    this.control.markAsTouched();
    this.onChange(this.control.value);
    this.onTouched();
    this.handleErrors();
  }

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

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.hasContent = this.content.nativeElement.classList.contains('has-content');
    this.changeDetection.detectChanges();
  }

  private setDayOfWeek() {
    if (this.control) {
      if (this.type === 'date') {
        const date: Date | string = this.control.value;
        if (typeof date === 'string') {
          this.dayOfWeek = new Date(date).getDate();
        } else {
          this.dayOfWeek = date.getDate();
        }
      }
    } else {
      this.dayOfWeek = new Date().getDate();
    }
  }

  private handleValueChanges() {
    this.isValid    = this.control.valid;
    this.isTouched  = this.control.touched;
    this.isPristine = this.control.pristine;
    this.isRequired = this.control.hasValidator(Validators.required);
    this.setDayOfWeek();
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

  private setType() {
    switch (this.type) {
      case 'currency':
        this._type = 'number';
        break;
      case 'search':
      case 'image':
        this._type = 'text';
        break;
      default:
        this._type = this.type;
    }
  }

}
