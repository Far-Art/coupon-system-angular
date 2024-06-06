import {Component, Input} from '@angular/core';
import {Coupon} from "../../../models/coupon.model";

@Component({
  selector: 'sc-coupon-item',
  templateUrl: './coupon-item.component.html',
  styleUrls: ['./coupon-item.component.scss']
})
export class CouponItemComponent {

  @Input() coupon: Coupon | undefined;

}
