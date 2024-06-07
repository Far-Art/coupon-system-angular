import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthComponent} from './auth.component';
import {LoginComponent} from './login/login.component';
import {CoreModule} from '../core/core.module';
import {AuthService} from './auth.service';
import { SignupComponent } from './signup/signup.component';
import {AuthRoutingModule} from './auth-routing.module';
import {SharedModule} from '../shared/shared.module';
import {HeaderModule} from '../header/header.module';


@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    SignupComponent
  ],
  exports: [
    AuthComponent,
    AuthRoutingModule
  ],
  imports: [
    CommonModule,
    CoreModule,
    AuthRoutingModule,
    SharedModule,
    HeaderModule
  ],
  providers: [
    AuthService
  ]
})
export class AuthModule {}
