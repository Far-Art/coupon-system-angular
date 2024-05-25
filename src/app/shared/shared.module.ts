import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliceTxtPipe } from './pipes/slice-txt.pipe';
import { UnfocusDirective } from './directives/unfocus.directive';



@NgModule({
  declarations: [
    SliceTxtPipe,
    UnfocusDirective
  ],
  exports: [
    SliceTxtPipe,
    UnfocusDirective
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
