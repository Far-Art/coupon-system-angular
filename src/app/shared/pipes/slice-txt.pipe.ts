import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'sliceTxt'
})
export class SliceTxtPipe implements PipeTransform {

  transform(value: string, maxLen: number): string {
    if (!value) {
      return value
    }
    return value.length > maxLen ? value.slice(0, maxLen) + '...' : value;
  }

}
