import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SliceTxtPipe} from './pipes/slice-txt.pipe';
import {UnfocusDirective} from './directives/unfocus.directive';
import {DatePickerComponent} from './components/date-picker/date-picker.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbDateAdapter, NgbDateParserFormatter, NgbInputDatepicker} from '@ng-bootstrap/ng-bootstrap';
import {CsDateFormatterService} from './components/date-picker/cs-date-formatter.service';
import {CsDateAdapterService} from './components/date-picker/cs-date-adapter.service';
import {ControlValuePipe} from './pipes/control-value.pipe';


@NgModule({
  declarations: [
    SliceTxtPipe,
    UnfocusDirective,
    DatePickerComponent,
    ControlValuePipe
  ],
  exports: [
    SliceTxtPipe,
    ControlValuePipe,
    UnfocusDirective,
    DatePickerComponent,
    FormsModule,
    ReactiveFormsModule
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbInputDatepicker
  ],
  providers: [
    {provide: NgbDateParserFormatter, useClass: CsDateFormatterService},
    {provide: NgbDateAdapter, useClass: CsDateAdapterService}
  ]
})
export class SharedModule {}
