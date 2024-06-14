import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SliceTxtPipe} from './pipes/slice-txt.pipe';
import {UnfocusDirective} from './directives/unfocus.directive';
import {DatePickerComponent} from './components/date-picker/date-picker.component';
import {NgbDateAdapter, NgbDateParserFormatter, NgbInputDatepicker} from '@ng-bootstrap/ng-bootstrap';
import {CsDateFormatterService} from './components/date-picker/cs-date-formatter.service';
import {CsDateAdapterService} from './components/date-picker/cs-date-adapter.service';
import {ControlValuePipe} from './pipes/control-value.pipe';
import {CouponTableComponent} from './components/coupon-table/coupon-table.component';
import {CouponItemComponent} from './components/coupon-table/coupon-item/coupon-item.component';
import {OffCanvasComponent} from './components/offcanvas/off-canvas.component';
import {CoreModule} from '../core/core.module';
import { HeaderContentDirective } from './directives/header-content.directive';
import { ModalComponent } from './components/modal/modal.component';


@NgModule({
  declarations: [
    SliceTxtPipe,
    UnfocusDirective,
    DatePickerComponent,
    CouponTableComponent,
    CouponItemComponent,
    ControlValuePipe,
    OffCanvasComponent,
    HeaderContentDirective,
    ModalComponent
  ],
  exports: [
    SliceTxtPipe,
    ControlValuePipe,
    UnfocusDirective,
    DatePickerComponent,
    CouponTableComponent,
    CouponItemComponent,
    OffCanvasComponent,
    HeaderContentDirective,
    ModalComponent
  ],
  imports: [
    CommonModule,
    NgbInputDatepicker,
    CoreModule
  ],
  providers: [
    {provide: NgbDateParserFormatter, useClass: CsDateFormatterService},
    {provide: NgbDateAdapter, useClass: CsDateAdapterService}
  ]
})
export class SharedModule {}
