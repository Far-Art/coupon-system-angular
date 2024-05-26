import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Coupon} from "../../../../shared/models/coupon.model";
import {CartService} from "../../../../header/quick-actions/cart/cart.service";
import {WishListService} from "../../../../header/quick-actions/wish-list/wish-list.service";
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'sc-coupon-card',
  templateUrl: './coupon-card.component.html',
  styleUrls: ['./coupon-card.component.scss'],

  // TODO fix animations
  animations: [
    trigger('icon', [
      transition(':enter', [
        animate('400ms ease', style({opacity: 1})),
      ]),
      transition(':leave', [
        animate('400ms ease', style({opacity: 0})),
      ])
    ]),
    trigger('addToCart', [
      transition(':enter', [
        animate('400ms ease', style({transform: 'scale(150%)', opacity: 0})),
      ])
    ]),
    trigger('showRemoveIcon', [
      transition(':enter', [
        animate('400ms ease', style({opacity: 1})),
      ])
    ]),
    trigger('showHeartIcon', [
      transition(':enter', [
        animate('400ms ease', style({transform: 'scale(150%)', opacity: 0})),
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

  constructor(private cartService: CartService, private wishListService: WishListService) {}

  ngOnInit(): void {
    this.isAddedToCart = this.cartService.isPresent(this.coupon);
    this.isAddedToWish = this.wishListService.isPresent(this.coupon);

    // 86_400_000 = 24 hours in millis
    this.isShowTimer = this.coupon.params.endDate.getTime() - new Date().getTime() < 86_400_000;
    if (this.isShowTimer) {
      this.timerValue = new Date(this.coupon.params.endDate.getTime() - new Date().getTime());
      const timeout   = setInterval(() => {
        if (new Date().getTime() <= this.timerValue!.getTime()) {
          this.isSaleEnded = true
          clearInterval(timeout);
          return;
        }
        this.timerValue = new Date(this.timerValue!.getTime() - 1000);
      }, 1000);
    }
  }

  onCartClick() {
    if (!this.isSaleEnded) {

      // TODO rework after resolving animation
      let timeout;
      this.isAddedToCart = !this.isAddedToCart;
      // this.isAddedToCart ? this.cartService.addToCart(this.coupon) : this.cartService.removeFromCart(this.coupon);
      if (this.isAddedToCart) {
        this.cartService.addToCart(this.coupon);
        timeout = setTimeout(() => this.isShowCartRemoveIcon = true, 400);
      } else {
        if (timeout) {
          clearTimeout(timeout);
        }
        this.cartService.removeFromCart(this.coupon);
        this.isShowCartRemoveIcon = false;
      }
    }
  }

  onWishListClick() {
    this.isAddedToWish = !this.isAddedToWish;
    this.isAddedToWish ? this.wishListService.addToWish(this.coupon) : this.wishListService.removeFromWish(this.coupon);
  }

  onTitleClick() {
    this.isDescriptionShown = false;
  }

  switchInfoDescription(){
    this.isDescriptionShown = !this.isDescriptionShown;
  }

  ngOnDestroy(): void {
  }

}
