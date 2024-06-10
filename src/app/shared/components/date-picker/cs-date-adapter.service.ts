import {Injectable} from '@angular/core';
import {NgbDateAdapter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';


@Injectable()
export class CsDateAdapterService extends NgbDateAdapter<string> {

  fromModel(value: string | null): NgbDateStruct | null {
    if (value == null) return null;
    const _d = value.substring(0, 10).split('-');
    return {
      day: parseInt(_d[2], 10),
      month: parseInt(_d[1], 10),
      year: parseInt(_d[0], 10)
    };
  }

  toModel(date: NgbDateStruct | null): string | null {
    if (date == null) return null;
    return new Date(date.year, date.month, date.day, 0, 0, 0).toISOString();
  }

}