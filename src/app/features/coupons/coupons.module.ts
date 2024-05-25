import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CouponsListComponent} from "./coupons-list/coupons-list.component";
import {CouponsPageComponent} from "./coupons-page/coupons-page.component";
import {CouponCardComponent} from "./coupons-list/coupon-card/coupon-card.component";
import {SharedModule} from "../../shared/shared.module";


@NgModule({
  declarations: [
    CouponsPageComponent,
    CouponsListComponent,
    CouponCardComponent,
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [CouponsPageComponent]
})
export class CouponsModule {}
