import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CouponsListComponent} from "./coupons-list/coupons-list.component";
import {CouponCardComponent} from "./coupons-list/coupon-card/coupon-card.component";
import {SharedModule} from "../../shared/shared.module";


@NgModule({
  declarations: [
    CouponsListComponent,
    CouponCardComponent,
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [CouponsListComponent]
})
export class CouponsModule {}
