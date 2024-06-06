import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthComponent} from './auth.component';
import {LoginComponent} from './login/login.component';
import {CoreModule} from '../core.module';
import {AuthService} from './auth.service';


@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent
  ],
  exports: [
    AuthComponent
  ],
  imports: [
    CommonModule,
    CoreModule
  ],
  providers: [
    AuthService
  ]
})
export class AuthModule {}
