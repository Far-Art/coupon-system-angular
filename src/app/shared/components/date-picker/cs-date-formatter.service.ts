import {Injectable} from '@angular/core';
import {NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';


@Injectable()
export class CsDateFormatterService extends NgbDateParserFormatter {

  format(date: NgbDateStruct | null): string | null {
    if (date == null) return null;
    return `${date.day < 10 ? '0' + date.day : date.day}/${date.month < 10 ? '0' + date.month : date.month}/${date.year}`;
  }

  parse(value: string | Date): NgbDateStruct | null {
    if (value == null) return null;
    const date           = (value instanceof Date ? value.toISOString().substring(0, 10) : value).replaceAll(/\//g, '-').split('-');
    const isYearAtLeftSide = date[0].length === 4;

    return {
      day: parseInt(isYearAtLeftSide ? date[2] : date[0], 10),
      month: parseInt(date[1], 10),
      year: parseInt(isYearAtLeftSide ? date[0] : date[2], 10)
    };
  }

}