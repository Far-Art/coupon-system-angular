import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Coupon} from '../../../../shared/models/coupon.model';
import {animate, style, transition, trigger} from '@angular/animations';


@Component({
  selector: 'sc-coupon-card',
  templateUrl: './coupon-card.component.html',
  styleUrls: ['./coupon-card.component.scss'],
  animations: [
    trigger('popUp', [
      transition(':enter', [
        style({opacity: 1, scale: 1}),
        animate('300ms ease-in-out', style({opacity: 1, scale: 3})),
        animate('300ms ease-in-out', style({opacity: 0, scale: 0.5}))
      ])
    ])
  ]
})
export class CouponCardComponent implements OnInit, OnDestroy {

  // 86_400_000 millis is equal to 24 hours
  private activateTimer = 86_400_000;

  @Input() coupon: Coupon;
  @Input() isAddedToCart? = false;
  @Input() isAddedToWish? = false;

  isDescriptionShown = false;
  isShowTimer        = true;
  timerValue: Date | undefined;
  isSaleEnded        = false;

  cartOnAddAnimationTrigger    = false;
  wishOnAddAnimationTrigger    = false;
  cartOnRemoveAnimationTrigger = false;
  wishOnRemoveAnimationTrigger = false;

  @Output() onCartClickEmitter = new EventEmitter<{ isAdded: boolean, coupon: Coupon }>();
  @Output() onWishClickEmitter = new EventEmitter<{ isAdded: boolean, coupon: Coupon }>();

  constructor() {}

  ngOnInit(): void {
    this.isShowTimer = this.coupon.params.endDate.getTime() - new Date().getTime() < this.activateTimer;
    if (this.isShowTimer) {
      this.timerValue       = new Date(this.coupon.params.endDate.getTime() - new Date().getTime());
      const timeoutInterval = setInterval(() => {
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
      this.isAddedToCart                = !this.isAddedToCart;
      this.cartOnRemoveAnimationTrigger = this.isAddedToCart === false;

      if (this.isAddedToCart) {
        this.cartOnAddAnimationTrigger = true;
        setTimeout(() => {
          this.cartOnAddAnimationTrigger = false;
        }, 600);
      }

      if (this.cartOnRemoveAnimationTrigger) {
        setTimeout(() => {
          this.cartOnRemoveAnimationTrigger = false;
        }, 600);
      }

      this.onCartClickEmitter.emit({isAdded: this.isAddedToCart, coupon: this.coupon});
    }
  }

  onWishListClick() {
    this.isAddedToWish                = !this.isAddedToWish;
    this.wishOnRemoveAnimationTrigger = this.isAddedToWish === false;

    if (this.isAddedToWish) {
      this.wishOnAddAnimationTrigger = true;
      setTimeout(() => {
        this.wishOnAddAnimationTrigger = false;
      }, 600);
    }

    if (this.wishOnRemoveAnimationTrigger) {
      setTimeout(() => {
        this.wishOnRemoveAnimationTrigger = false;
      }, 600);
    }

    this.onWishClickEmitter.emit({isAdded: this.isAddedToWish, coupon: this.coupon});
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
