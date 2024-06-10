import {Component, EventEmitter, forwardRef, Input, OnInit, Output} from '@angular/core';
import {NgbDate, NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';


@Component({
  selector: 'sc-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => DatePickerComponent)
    }
  ]
})
export class DatePickerComponent implements OnInit, ControlValueAccessor {

  @Input() date?: Date | string;

  @Input() minDate?: Date | string;

  @Input() maxDate?: Date | string;

  @Output() valueEmitter = new EventEmitter<Date>();

  formControl: FormControl<string | null>;

  _displayedDate: string;

  _minDate: NgbDateStruct;

  _maxDate: NgbDateStruct;

  isDisabled = false;

  constructor(private formatter: NgbDateParserFormatter) {}

  ngOnInit(): void {
    // this.formControl.valueChanges
    //     .pipe(
    //         debounceTime(200),
    //         tap(value => this.onChange(value))
    //     )
    //     .subscribe();
    // TODO rework this component
    const date = new Date();
    this.initForm()

    // if (this.date) {
    //   this._displayedDate = this.formatter.format(this.toNgbDate(this.date));
    // }

    if (this.minDate) {
      if (this.minDate instanceof Date) {
        this._minDate = {
          year: this.minDate.getFullYear(),
          month: this.minDate.getMonth() + 1,
          day: this.minDate.getDay()
        }
      } else {
        this._minDate = this.toNgbDate(this.minDate);
      }
    } else {
      this._minDate = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDay()
      }
    }

    if (this.maxDate) {
      if (this.maxDate instanceof Date) {
        this._maxDate = {
          year: this.maxDate.getFullYear(),
          month: this.maxDate.getMonth() + 1,
          day: this.maxDate.getDay()
        }
      } else {
        this._maxDate = this.toNgbDate(this.maxDate);
      }
    } else {
      this._maxDate = {
        year: date.getFullYear(),
        month: (date.getMonth() + 3) % 12,
        day: (date.getMonth() + 3) % 12 === 1 && date.getDay() > 28 ? 28 : date.getDay()
      }
    }
  }

  onDateSelect(ngbDate: NgbDate) {
    const date = new Date(new Date().setFullYear(ngbDate.year, ngbDate.month - 1, ngbDate.day));
    // this.onChange(this.parseDate(date));
    // this.valueEmitter.emit(date);
  }

  onChange: (value: any) => void;
  onTouched: () => void;

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  writeValue(date: string): void {
    this.date           = date;
    this._displayedDate = this.formatToDisplayedDate(this.toNgbDate(date));
  }

  parseDate(date: Date | string): Date | null {
    if (date == null) return null;
    const _d = (date instanceof Date ? date.toISOString() : date).substring(0, 10).replace(/[ :]/g, '-').split('-');
    return new Date(+_d[0], +_d[1], +_d[2], 0, 0, 0);
  }

  private toNgbDate(date: string | Date): NgbDateStruct | null {
    if (date == null) return null;

    const _date   = date instanceof Date ? date.toISOString().substring(0, 10) : date;
    const dateArr = _date.replaceAll(/\\/g, '-').split('-');

    return {
      year: +dateArr[0],
      month: +dateArr[1],
      day: +dateArr[2]
    }
  }

  private formatToDisplayedDate(date: NgbDateStruct | null): string {
    const _date = this.formatter.format(date);
    return date ? _date : 'Please select a date';
  }

  private initForm() {
    this.formControl = new FormControl<string>(this.date instanceof Date ? this.date.toISOString().substring(0, 10) : this.date);
    console.log(this.formControl.value)
  }

}
