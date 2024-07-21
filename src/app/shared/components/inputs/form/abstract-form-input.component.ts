import {AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostBinding, Input, OnChanges, OnDestroy, OnInit, Optional, Renderer2, ViewChild} from '@angular/core';
import {AbstractControl, ControlValueAccessor, FormGroup, FormGroupDirective, FormGroupName, Validators} from '@angular/forms';
import {IdGeneratorService} from '../../../services/id-generator.service';
import {Subscription} from 'rxjs';
import {HostComponent} from '../../basic/host/host.component';
import {BackdropService} from '../../../../core/services/backdrop/backdrop.service';


export interface FormErrorParams<T> {
  evaluate: (value: T) => boolean,
  message: string
}

export type InputTypes = 'text' | 'textarea' | 'number' | 'currency' | 'date' | 'email' | 'password' | 'button' | 'checkbox' | 'radio' | 'range' | 'image' | 'search';

@Component({
  templateUrl: './abstract-form-input.component.html'
})
export class AbstractFormInputComponent<T> extends HostComponent implements OnInit, OnChanges, AfterContentInit, AfterViewInit, ControlValueAccessor, OnDestroy {

  @Input() id: string = this.idGenerator.generate();
  @Input() label: string = 'input';
  @Input() type: InputTypes = 'text';
  @Input() options: T[] = [];
  @Input() disabled: boolean;
  @Input() errors: FormErrorParams<T> | FormErrorParams<T>[];
  @Input() min: number;
  @Input() max: number;
  value: T;
  form: FormGroup;
  control: AbstractControl<any, any>;
  isTouched: boolean;
  isPristine: boolean;
  isValid: boolean;
  isRequired: boolean;
  hasContent: boolean;
  nodeName: string;
  dayOfWeek: number;
  errorMessages: string[] = [];
  @ViewChild('content', {static: true}) protected content: ElementRef<HTMLDivElement>;
  @HostBinding('style.width') protected width = '100%';
  @HostBinding('attr.disabled') protected isDisabled = false;
  protected _type: Exclude<InputTypes, 'currency' | 'search' | 'image' | 'textarea'>;
  protected _min: number;
  protected _max: number;
  private _subscription: Subscription;

  constructor(
      protected idGenerator: IdGeneratorService,
      protected backdropService: BackdropService,
      protected elRef: ElementRef<HTMLElement>,
      protected changeDetector: ChangeDetectorRef,
      protected renderer: Renderer2,
      @Optional() protected rootForm: FormGroupDirective,
      @Optional() protected formGroup: FormGroupName
  ) {super(elRef);}

  onChange: any = () => {};

  onTouched: any = () => {};

  ngOnInit(): void {
    this.setType();
    this.setMinMax();
    this.nodeName = this.elRef.nativeElement.nodeName;
  }

  ngOnChanges(): void {
    this.isDisabled = this.disabled;
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
    this.value = this.type === 'checkbox' ? input.checked as T : input.value as T;
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
    if (this._subscription) this._subscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.hasContent = this.content?.nativeElement.classList.contains('has-content');
    this.changeDetector.detectChanges();
  }

  ngAfterContentInit(): void {
    if (this.rootForm) {
      this.form = this.rootForm.form;

      if (this.formGroup != null) {
        this.control = this.form.get(this.formGroup.path);
      } else {
        const controlName = this.elRef.nativeElement.attributes.getNamedItem('formcontrolname');
        this.control = this.form.get(controlName?.value);
      }

      if (this.control) {
        this.handleFormStatusChanges();
        this._subscription = this.control.valueChanges.subscribe(() => this.handleFormStatusChanges());
      }
    }
  }

  onHostClick(event: Event): void {}

  private setDayOfWeekIfDate() {
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

  private handleFormStatusChanges() {
    this.isValid = this.control.valid;
    this.isTouched = this.control.touched;
    this.isPristine = this.control.pristine;
    this.isRequired = this.control.hasValidator(Validators.required);
    this.setDayOfWeekIfDate();
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
      case 'textarea':
      case 'image':
        this._type = 'text';
        break;
      default:
        this._type = this.type;
    }
  }

  private setMinMax() {
    if (this.min != null || this.max != null) {
      this._min = this.min;
      this._max = this.max;
    }

  }

}
