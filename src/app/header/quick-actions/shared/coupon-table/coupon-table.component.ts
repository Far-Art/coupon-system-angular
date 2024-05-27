import {Component, Input} from '@angular/core';
import {Coupon} from "../../../../shared/models/coupon.model";

@Component({
  selector: 'sc-coupon-table',
  templateUrl: './coupon-table.component.html',
  styleUrls: ['./coupon-table.component.scss']
})
export class CouponTableComponent {

  @Input() coupons: Coupon[] = [];

}
