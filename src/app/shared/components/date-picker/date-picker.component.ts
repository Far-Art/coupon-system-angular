import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgbDate, NgbDateParserFormatter, NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'sc-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: DatePickerComponent
    }
  ]
})
export class DatePickerComponent implements OnInit, ControlValueAccessor {

  @Input() value?: Date | string;

  @Input() minDate?: Date | string;

  @Input() maxDate?: Date | string;

  @Output() valueEmitter = new EventEmitter<Date>();

  _displayedDate: string;

  _minDate: NgbDateStruct;

  _maxDate: NgbDateStruct;

  constructor(private formatter: NgbDateParserFormatter) {}

  ngOnInit(): void {
    const date = new Date();

    if (this.value) {
      this._displayedDate = this.formatter.format(this.parseDate(this.value));
    }

    if (this.minDate) {
      if (this.minDate instanceof Date) {
        this._minDate = {
          year: this.minDate.getFullYear(),
          month: this.minDate.getMonth() + 1,
          day: this.minDate.getDay()
        }
      } else {
        this._minDate = this.parseDate(this.minDate);
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
        this._maxDate = this.parseDate(this.maxDate);
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
    this.onChange(date);
    this.valueEmitter.emit(date);
  }

  private parseDate(date: string | Date): NgbDateStruct {
    let _date: string;
    if (date instanceof Date) {
      _date = date.toISOString().substring(0, 10);
    } else {
      _date = date;
    }
    const dateArr = _date.replaceAll(/\\/g, '-').split('-');
    return {
      year: +dateArr[0],
      month: +dateArr[1],
      day: +dateArr[2]
    }
  }

  onChange = (date: Date) => {};

  registerOnChange(fn: (value: Date) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  writeValue(date: Date): void {
    this.value          = date;
    this._displayedDate = this.formatter.format(this.parseDate(this.value));
  }

}
