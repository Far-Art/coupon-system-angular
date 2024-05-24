import {Component, Input} from '@angular/core';
import {Coupon} from "../../../../shared/models/coupon.model";

@Component({
  selector: 'sc-coupon-card',
  templateUrl: './coupon-card.component.html',
  styleUrls: ['./coupon-card.component.scss']
})
export class CouponCardComponent {

  @Input() coupon!: Coupon;

  isAdded = false;

  onAddToCart() {
    this.isAdded = true;
  }
}
