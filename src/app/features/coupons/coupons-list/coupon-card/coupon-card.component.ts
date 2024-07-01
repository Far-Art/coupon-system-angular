import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';
import {Coupon} from '../../../../shared/models/coupon.model';
import {animate, style, transition, trigger} from '@angular/animations';
import {CouponsService} from '../../coupons.service';
import {Subscription} from 'rxjs';
import {WindowSizeService} from '../../../../shared/services/window-size.service';


@Component({
  selector: 'sc-coupon-card',
  templateUrl: './coupon-card.component.html',
  styleUrls: ['./coupon-card.component.scss'],
  animations: [
    trigger('popUp', [
      transition(':enter', [
        style({opacity: 1, scale: 1}),
        animate('500ms ease-out', style({opacity: 0, scale: 3.5, transform: 'translateY(-5%)'}))
      ])
    ])
  ]
})
export class CouponCardComponent implements OnInit, OnDestroy {

  @ViewChild('card', {static: true}) private cardElement: ElementRef;
  @ViewChild('title', {static: true}) private cardTitle: ElementRef;

  // 86_400_000 millis is equal to 24 hours
  private activateTimer        = 86_400_000;
  private animationDismissTime = 500;

  @Input() coupon: Coupon;

  @Output() onCartClickEmitter = new EventEmitter<{ isChecked: boolean, coupon: Coupon }>();
  @Output() onWishClickEmitter = new EventEmitter<{ isChecked: boolean, coupon: Coupon }>();

  isAddedToCart      = false;
  isAddedToWish      = false;
  isPurchased        = false;
  isDescriptionShown = false;
  isShowTimer        = true;
  timerValue: Date | undefined;
  isSaleEnded        = false;
  titleMaxLen: number;

  cartOnAddAnimationTrigger    = false;
  wishOnAddAnimationTrigger    = false;
  cartOnRemoveAnimationTrigger = false;
  wishOnRemoveAnimationTrigger = false;

  private wishSub: Subscription;
  private cartSub: Subscription;
  private windowSizeSub: Subscription;
  private purchasedSub: Subscription;

  constructor(
      private couponsService: CouponsService,
      private windowSize: WindowSizeService,
      private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.showSaleEndTimout();

    this.wishSub = this.couponsService.wishIds$.subscribe(ids => {
      this.isAddedToWish = ids.includes(this.coupon.params.id);
    });

    this.cartSub = this.couponsService.cartIds$.subscribe(ids => {
      this.isAddedToCart = ids.includes(this.coupon.params.id);
    });

    this.purchasedSub = this.couponsService.purchasedCoupons$.subscribe(ids => {
      this.isPurchased = ids.includes(this.coupon.params.id);
    })

    this.windowSizeSub = this.windowSize.windowSize$.subscribe(size => {
      if (size.width > 1200) {
        this.renderer.setStyle(this.cardElement.nativeElement, 'width', '450px');
        this.renderer.setStyle(this.cardElement.nativeElement, 'height', '260px');
        this.renderer.setStyle(this.cardTitle.nativeElement, 'font-size', '1rem');
        this.titleMaxLen = 40;
      } else if (size.width > 810) {
        this.renderer.setStyle(this.cardElement.nativeElement, 'width', '330px');
        this.renderer.setStyle(this.cardElement.nativeElement, 'height', '220px');
        this.renderer.setStyle(this.cardTitle.nativeElement, 'font-size', '0.9rem');
        this.titleMaxLen = 20;
      } else {
        this.renderer.setStyle(this.cardElement.nativeElement, 'width', '300px');
        this.renderer.setStyle(this.cardElement.nativeElement, 'height', '180px');
        this.renderer.setStyle(this.cardTitle.nativeElement, 'font-size', '0.8rem');
        this.titleMaxLen = 17;
      }
    })
  }

  onCartClick() {
    if (!this.isSaleEnded && !this.isPurchased) {
      this.isAddedToCart ? this.couponsService.removeFromCart(this.coupon) : this.couponsService.addToCart(this.coupon);
      this.cartOnRemoveAnimationTrigger = !this.isAddedToCart;

      if (this.isAddedToCart) {
        this.cartOnAddAnimationTrigger = true;
        setTimeout(() => {
          this.cartOnAddAnimationTrigger = false;
        }, this.animationDismissTime);
      }

      if (this.cartOnRemoveAnimationTrigger) {
        setTimeout(() => {
          this.cartOnRemoveAnimationTrigger = false;
        }, this.animationDismissTime);
      }
    }
  }

  onWishListClick() {
    this.isAddedToWish ? this.couponsService.removeFromWish(this.coupon) : this.couponsService.addToWish(this.coupon);
    this.wishOnRemoveAnimationTrigger = !this.isAddedToWish;

    if (this.isAddedToWish) {
      this.wishOnAddAnimationTrigger = true;
      setTimeout(() => {
        this.wishOnAddAnimationTrigger = false;
      }, this.animationDismissTime);
    }

    if (this.wishOnRemoveAnimationTrigger) {
      setTimeout(() => {
        this.wishOnRemoveAnimationTrigger = false;
      }, this.animationDismissTime);
    }

    this.onWishClickEmitter.emit({isChecked: this.isAddedToWish, coupon: this.coupon});
  }

  onTitleClick() {
    this.isDescriptionShown = false;
  }

  switchInfoDescription() {
    this.isDescriptionShown = !this.isDescriptionShown;
  }

  private showSaleEndTimout() {
    this.isSaleEnded = this.coupon.params.isSaleEnded;
    this.isShowTimer = this.coupon.params.endDate.getTime() - new Date().getTime() < this.activateTimer;
    if (this.isSaleEnded) return;

    if (this.isShowTimer) {
      this.timerValue       = new Date(this.coupon.params.endDate.getTime() - new Date().getTime());
      const timeoutInterval = setInterval(() => {
        if (new Date() <= this.timerValue) {
          this.isSaleEnded = true
          clearInterval(timeoutInterval);
          return;
        }
        this.timerValue = new Date(this.timerValue.getTime() - 1000);
      }, 1000);
    }
  }

  ngOnDestroy(): void {
    this.wishSub.unsubscribe();
    this.cartSub.unsubscribe();
    this.windowSizeSub.unsubscribe();
    this.purchasedSub.unsubscribe();
  }
}
