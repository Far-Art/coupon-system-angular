import {Pipe, PipeTransform} from '@angular/core';
import {FormGroup} from '@angular/forms';


@Pipe({
  name: 'csControlValue'
})
export class ControlValuePipe implements PipeTransform {

  transform(form: FormGroup, path?: string): unknown {
    return path ? form.get(path.split('.')).value : form.value;
  }

}
