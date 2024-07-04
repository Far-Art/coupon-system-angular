import {Component, Input} from '@angular/core';
import {ModalButtonComponent} from '../../modal/modal-button/modal-button.component';
import {FormControl, FormGroup} from '@angular/forms';


@Component({
  selector: 'cs-form-button',
  templateUrl: './form-button.component.html',
  styleUrls: ['./form-button.component.scss']
})
export class FormButtonComponent extends ModalButtonComponent {

  @Input() form: FormGroup;

  override ngOnInit(): void {
    super.ngOnInit();
  }

  onClick() {
    if (this.form?.invalid && this.type === 'submit') {
      // console.log('log')

      this.form.setValue(this.form.value);
      this.form.markAllAsTouched();
      this.form.markAsDirty();

      for (const controlName in this.form.controls) {
        this.form.get(controlName).markAsDirty();
        this.form.get(controlName).markAsTouched();
      }

      console.log(this.form);
    }
  }

}
