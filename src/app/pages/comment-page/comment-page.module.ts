import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CommentPageComponent} from './comment-page.component';
import {CommentFormComponent} from './comment-form/comment-form.component';
import {CommentRoutingModule} from './comment-routing.module';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';


@NgModule({
  declarations: [
    CommentPageComponent,
    CommentFormComponent
  ],
  imports: [
    CommonModule,
    CommentRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class CommentPageModule {}
