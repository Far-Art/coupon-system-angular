import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthComponent} from './auth.component';
import {LoginComponent} from './login/login.component';
import {CoreModule} from '../core.module';
import {AuthService} from './auth.service';
import { SignupComponent } from './signup/signup.component';


@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    SignupComponent
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
