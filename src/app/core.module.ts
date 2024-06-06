import {NgModule} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [],
  imports: [],
  exports: [
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule
  ],
  providers: []
})
export class CoreModule {
}
