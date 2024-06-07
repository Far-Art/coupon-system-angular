import {NgModule} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';


@NgModule({
  declarations: [],
  imports: [],
  exports: [
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule,
    NgbModule
  ],
  providers: []
})
export class CoreModule {
}
