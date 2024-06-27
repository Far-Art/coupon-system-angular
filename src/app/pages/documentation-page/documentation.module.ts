import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DocumentationPageComponent} from './documentation-page.component';
import {DocumentationRoutingModule} from './documentation-routing.module';


@NgModule({
  declarations: [
    DocumentationPageComponent
  ],
  imports: [
    CommonModule,
    DocumentationRoutingModule
  ]
})
export class DocumentationModule {}
