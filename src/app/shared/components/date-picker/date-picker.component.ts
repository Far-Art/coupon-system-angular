import {Component, Input, OnInit} from '@angular/core';
import {NgbDateParserFormatter, NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'sc-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent implements OnInit {

  @Input() value?: Date | string;

  @Input() minDate?: Date | string;

  @Input() maxDate?: Date | string;

  _value!: string;

  _minDate!: NgbDateStruct;

  _maxDate!: NgbDateStruct;

  constructor(private formatter: NgbDateParserFormatter) {}

  ngOnInit(): void {
    const date = new Date();

    if (this.value) {
      const dateArr = this.formatDate(this.value).split('/');
      this._value   = this.formatter.format(this.parseDate(this.value));

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

  private formatDate(date: string | Date): string {
    const parsed = this.parseDate(date);
    return `${parsed.day}/${parsed.month}/${parsed.year}`;
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

}
