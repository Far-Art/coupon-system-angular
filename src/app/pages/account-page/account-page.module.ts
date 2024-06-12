import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AccountPageComponent} from './account-page.component';
import {AccountRoutingModule} from './account-routing.module';
import {HeaderModule} from '../../header/header.module';


@NgModule({
  declarations: [
    AccountPageComponent
  ],
  imports: [
    CommonModule,
    HeaderModule,
    AccountRoutingModule
  ],
  exports: []
})
export class AccountPageModule {}
