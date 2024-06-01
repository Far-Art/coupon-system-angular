import {Component, OnDestroy, OnInit} from '@angular/core';
import {CouponsService} from '../coupons.service';
import {Coupon} from '../../../shared/models/coupon.model';
import {map, Subscription} from 'rxjs';


@Component({
  selector: 'cs-coupons-list',
  templateUrl: './coupons-list.component.html',
  styleUrls: ['./coupons-list.component.scss']
})
export class CouponsListComponent implements OnInit, OnDestroy {

  coupons: { coupon: Coupon, isInCart: boolean, isInWish: boolean }[] = [];

  private displayedSub: Subscription;
  private cartSub: Subscription;
  private wishSub: Subscription;

  constructor(private couponService: CouponsService) {}

  ngOnInit(): void {
    this.displayedSub = this.couponService.displayedCoupons$.pipe(map(coupons => {
      return coupons.map(c => {
        return {
          coupon: c,
          isInCart: this.couponService.isPresentInCart(c),
          isInWish: this.couponService.isPresentInWish(c)
        }
      });
    })).subscribe(list => this.coupons = list);
  }

  onCartListener(event: { isAdded: boolean, coupon: Coupon }) {
    console.log(event);
    event.isAdded ? this.couponService.addToCart(event.coupon) : this.couponService.removeFromCart(event.coupon);
  }

  onWishListener(event: { isAdded: boolean, coupon: Coupon }) {
    event.isAdded ? this.couponService.addToWish(event.coupon) : this.couponService.removeFromWish(event.coupon);
  }

  ngOnDestroy(): void {
    this.displayedSub.unsubscribe();
    this.cartSub.unsubscribe();
    this.wishSub.unsubscribe();
  }
}
