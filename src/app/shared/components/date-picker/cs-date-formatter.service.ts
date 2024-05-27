import {Injectable} from "@angular/core";
import {NgbDateParserFormatter, NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";

@Injectable()
export class CsDateFormatterService extends NgbDateParserFormatter {

  format(date: NgbDateStruct | null): string {
    return date ? `${date.day < 10 ? '0' + date.day : date.day}/${date.month < 10 ? '0' + date.month : date.month}/${date.year}` : '';
  }

  parse(value: string | Date): NgbDateStruct | null {
    if (value) {
      if (value instanceof Date) {
        value = value.toISOString().substring(0, 10);
      }

      const date = value.replaceAll(/\//g, '-').split('-');
      const yal  = date[0].length === 4;
      return {
        day: parseInt(yal ? date[0] : date[2], 10),
        month: parseInt(date[1], 10),
        year: parseInt(yal ? date[2] : date[0], 10),
      };
    }
    return null;
  }

}