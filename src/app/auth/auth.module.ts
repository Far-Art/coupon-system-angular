import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthComponent} from './auth.component';
import {LoginComponent} from './login/login.component';
import {CoreModule} from '../core.module';
import {AuthService} from './auth.service';
import { SignupComponent } from './signup/signup.component';
import {AuthRoutingModule} from './auth-routing.module';


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
    CoreModule,
    AuthRoutingModule
  ],
  providers: [
    AuthService
  ]
})
export class AuthModule {}
