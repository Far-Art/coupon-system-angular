import {Injectable} from "@angular/core";
import {NgbDateAdapter, NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";

@Injectable()
export class CsDateAdapterService extends NgbDateAdapter<string> {

  fromModel(value: string | null): NgbDateStruct | null {
    if (value) {
      const date = value.split('/');
      return {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10),
      };
    }
    return null;
  }

  toModel(date: NgbDateStruct | null): string | null {
    return date ? date.day + '/' + date.month + '/' + date.year : null;
  }

}