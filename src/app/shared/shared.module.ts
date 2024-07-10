import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SliceTxtPipe} from './pipes/slice-txt.pipe';
import {DatePickerComponent} from './components/date-picker/date-picker.component';
import {NgbDateAdapter, NgbDateParserFormatter, NgbInputDatepicker} from '@ng-bootstrap/ng-bootstrap';
import {CsDateFormatterService} from './components/date-picker/cs-date-formatter.service';
import {CsDateAdapterService} from './components/date-picker/cs-date-adapter.service';
import {ControlValuePipe} from './pipes/control-value.pipe';
import {CouponTableComponent} from './components/coupon-table/coupon-table.component';
import {CouponItemComponent} from './components/coupon-table/coupon-item/coupon-item.component';
import {OffCanvasComponent} from './components/offcanvas/off-canvas.component';
import {HeaderContentDirective} from './directives/header-content.directive';
import {ModalComponent} from './components/modal/modal.component';
import {ConfirmNavigationComponent} from '../core/guards/confirm-navigation/confirm-navigation.component';
import {SpinnerComponent} from './components/spinner/spinner.component';
import {ModalHeaderComponent} from './components/modal/modal-header/modal-header.component';
import {ModalBodyComponent} from './components/modal/modal-body/modal-body.component';
import {ModalFooterComponent} from './components/modal/modal-footer/modal-footer.component';
import {ModalButtonComponent} from './components/modal/modal-button/modal-button.component';
import {IdGeneratorService} from './services/id-generator.service';
import {FormInputComponent} from './components/inputs/form-input/form-input.component';
import {FormSelectComponent} from './components/inputs/form-select/form-select.component';
import {AbstractFormInputComponent} from './components/inputs/abstract-form-input.component';
import {CheckNgContentDirective} from './directives/check-ng-content.directive';
import {ModalBackdropComponent} from './components/modal/modals-container/modal-backdrop/modal-backdrop.component';
import {ModalsContainerComponent} from './components/modal/modals-container/modals-container.component';
import {ReactiveFormsModule} from '@angular/forms';
import { ButtonComponent } from './components/basic/button/button.component';


@NgModule({
  declarations: [
    SliceTxtPipe,
    DatePickerComponent,
    CouponTableComponent,
    CouponItemComponent,
    ControlValuePipe,
    OffCanvasComponent,
    HeaderContentDirective,
    ModalComponent,
    ModalHeaderComponent,
    ModalBodyComponent,
    ModalFooterComponent,
    ConfirmNavigationComponent,
    SpinnerComponent,
    ModalButtonComponent,
    FormInputComponent,
    FormSelectComponent,
    AbstractFormInputComponent,
    CheckNgContentDirective,
    ModalBackdropComponent,
    ModalsContainerComponent,
    ButtonComponent
  ],
  exports: [
    SliceTxtPipe,
    ControlValuePipe,
    DatePickerComponent,
    CouponTableComponent,
    CouponItemComponent,
    OffCanvasComponent,
    HeaderContentDirective,
    ModalComponent,
    ModalHeaderComponent,
    ModalBodyComponent,
    ModalFooterComponent,
    ConfirmNavigationComponent,
    SpinnerComponent,
    ModalButtonComponent,
    FormInputComponent,
    FormSelectComponent,
    AbstractFormInputComponent,
    ModalBackdropComponent,
    ModalsContainerComponent
  ],
  imports: [
    CommonModule,
    NgbInputDatepicker,
    ReactiveFormsModule
    // CoreModule
  ],
  providers: [
    IdGeneratorService, {
      provide: NgbDateParserFormatter,
      useClass: CsDateFormatterService
    }, {
      provide: NgbDateAdapter,
      useClass: CsDateAdapterService
    }
  ]
})
export class SharedModule {}
