import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AccountPageComponent} from './account-page.component';
import {AccountRoutingModule} from './account-routing.module';
import {HeaderModule} from '../../header/header.module';
import {AccountInfoComponent} from './account-info/account-info.component';
import {AccountService} from './account.service';
import {AccountEditComponent} from './account-edit/account-edit.component';
import {PurchasedComponent} from './purchased/purchased.component';
import {SharedModule} from '../../shared/shared.module';
import {CoreModule} from '../../core/core.module';
import {ReactiveFormsModule} from '@angular/forms';
import {ManageAccountComponent} from './manage-account/manage-account.component';
import {CreateCouponModalComponent} from './manage-account/modals/create-coupon-modal/create-coupon-modal.component';
import {UsersManageModalComponent} from './manage-account/modals/users-manage-modal/users-manage-modal.component';
import {ManageCouponsModalComponent} from './manage-account/modals/manage-coupons-modal/manage-coupons-modal.component';


@NgModule({
  declarations: [
    AccountPageComponent,
    AccountInfoComponent,
    AccountEditComponent,
    PurchasedComponent,
    ManageAccountComponent,
    CreateCouponModalComponent,
    ManageCouponsModalComponent,
    UsersManageModalComponent
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
