import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AccountPageComponent} from './account-page.component';
import {AccountRoutingModule} from './account-routing.module';
import {HeaderModule} from '../../header/header.module';
import {AccountInfoComponent} from './account-info/account-info.component';
import {AccountService} from './account.service';
import { AccountEditComponent } from './account-edit/account-edit.component';
import { PurchasedComponent } from './purchased/purchased.component';
import {SharedModule} from '../../shared/shared.module';
import {CoreModule} from '../../core/core.module';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    AccountPageComponent,
    AccountInfoComponent,
    AccountEditComponent,
    PurchasedComponent
  ],
  imports: [
    CommonModule,
    HeaderModule,
    AccountRoutingModule,
    SharedModule,
    CoreModule,
    ReactiveFormsModule
  ],
  exports: [],
  providers: [AccountService]
})
export class AccountPageModule {}
