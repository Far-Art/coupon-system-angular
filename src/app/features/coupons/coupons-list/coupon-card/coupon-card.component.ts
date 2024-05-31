import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Coupon} from '../../../../shared/models/coupon.model';
import {animate, style, transition, trigger} from '@angular/animations';
import {CouponsService} from '../../coupons.service';


@Component({
  selector: 'sc-coupon-card',
  templateUrl: './coupon-card.component.html',
  styleUrls: ['./coupon-card.component.scss'],

  // TODO fix animations
  animations: [
    trigger('icon', [
      transition(':enter', [
        animate('400ms ease', style({opacity: 1}))
      ]),
      transition(':leave', [
        animate('400ms ease', style({opacity: 0}))
      ])
    ]),
    trigger('addToCart', [
      transition(':enter', [
        animate('400ms ease', style({transform: 'scale(150%)', opacity: 0}))
      ])
    ]),
    trigger('showRemoveIcon', [
      transition(':enter', [
        animate('400ms ease', style({opacity: 1}))
      ])
    ]),
    trigger('showHeartIcon', [
      transition(':enter', [
        animate('400ms ease', style({transform: 'scale(150%)', opacity: 0}))
      ])
    ])
  ]
})
export class CouponCardComponent implements OnInit, OnDestroy {

  @Input() coupon!: Coupon;

  isAddedToCart        = false;
  isAddedToWish        = false;
  isDescriptionShown   = false;
  isShowTimer          = true;
  timerValue: Date | undefined;
  isSaleEnded          = false;
  isShowCartRemoveIcon = false; // TODO rework after angular.io site is available again

  constructor(private couponsService: CouponsService) {}

  ngOnInit(): void {
    this.isAddedToCart = this.couponsService.isPresentInCart(this.coupon);
    this.isAddedToWish = this.couponsService.isPresentInWish(this.coupon);

    // 86_400_000 = 24 hours in millis
    this.isShowTimer = this.coupon.params.endDate.getTime() - new Date().getTime() < 86_400_000;
    if (this.isShowTimer) {
      this.timerValue = new Date(this.coupon.params.endDate.getTime() - new Date().getTime());
      const timeoutInterval   = setInterval(() => {
        if (new Date() <= this.timerValue) {
          this.isSaleEnded = true
          clearInterval(timeoutInterval);
          return;
        }
        this.timerValue = new Date(this.timerValue!.getTime() - 1000);
      }, 1000);
    }
  }

  onCartClick() {
    if (!this.isSaleEnded) {

      // TODO rework after resolving animation
      let timeout: any;
      this.isAddedToCart = !this.isAddedToCart;
      // this.isAddedToCart ? this.cartService.addToCart(this.coupon) : this.cartService.removeFromCart(this.coupon);
      if (this.isAddedToCart) {
        this.couponsService.addToCart(this.coupon);
        // noinspection JSUnusedAssignment
        timeout = setTimeout(() => this.isShowCartRemoveIcon = true, 400);
      } else {
        if (timeout) {
          clearTimeout(timeout);
        }
        this.couponsService.removeFromCart(this.coupon);
        this.isShowCartRemoveIcon = false;
      }
    }
  }

  onWishListClick() {
    this.isAddedToWish = !this.isAddedToWish;
    this.isAddedToWish ? this.couponsService.addToWish(this.coupon) : this.couponsService.removeFromWish(this.coupon);
  }

  onTitleClick() {
    this.isDescriptionShown = false;
  }

  switchInfoDescription() {
    this.isDescriptionShown = !this.isDescriptionShown;
  }

  ngOnDestroy(): void {
  }

}
