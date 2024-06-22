import {Component, OnDestroy, OnInit} from '@angular/core';
import {delay, Subscription} from 'rxjs';
import {CartService} from './cart.service';
import {Coupon} from '../../../../../shared/models/coupon.model';
import {CouponsService} from '../../../../../features/coupons/coupons.service';
import {WindowSizeService} from '../../../../../shared/services/window-size.service';


@Component({
  selector: 'sc-cart-modal',
  templateUrl: './cart-modal.component.html',
  styleUrls: ['./cart-modal.component.scss']
})
export class CartModalComponent implements OnInit, OnDestroy {

  cartList: Coupon[] = [];

  readonly _selectedCoupons: Coupon[] = [];

  totalPrice: number;

  _windowWidth: number;

  _switchWidth = 576;

  isUserPresent: boolean;

  isLoading = false;

  errorMessage: string;

  private cartSubscription: Subscription;
  private windowSubscription: Subscription;
  private userSubscription: Subscription;
  private purchasedSubscription: Subscription;

  constructor(
      private couponsService: CouponsService,
      private cartService: CartService,
      private windowSize: WindowSizeService
  ) {}

  ngOnInit(): void {
    this.windowSubscription = this.windowSize.windowSize$.subscribe(size => {
      this._windowWidth = size.width;
    })

    this.cartSubscription = this.couponsService.cartIds$.subscribe(ids => {
      this.cartList = this.couponsService.getCouponsById(...ids);
    });

    this.purchasedSubscription = this.couponsService.purchasedCoupons$.subscribe(ids => this.couponsService.moveToWish(...ids))
    this.userSubscription      = this.cartService.isUserPresent$().subscribe(isPresent => this.isUserPresent = isPresent);
  }

  onCouponsSelected(coupons: Coupon[]) {
    this._selectedCoupons.length = 0
    this._selectedCoupons.push(...coupons);
    this.cartService.updateUserCart(this._selectedCoupons);
    this.updatePrice();
  }

  onCancel() {
    this._selectedCoupons.length = 0;
  }

  onDelete() {
    this.couponsService.removeFromCart(...this._selectedCoupons);
    this.onCancel();
  }

  onMove() {
    this.couponsService.moveToWish(...this._selectedCoupons);
    this.onCancel();
  }

  onBuy() {
    this.errorMessage = null;
    if (this._selectedCoupons.length > 0) {
      this.isLoading = true;
      this.cartService.buyCoupons$(this._selectedCoupons).pipe(
          delay(1000)
      ).subscribe({
        next: () => {
          this.isLoading = false;
        }, error: (err: Error) => {
          this.isLoading    = false;
          this.errorMessage = err.message;
        }
      });
    }
  }

  private updatePrice() {
    this.totalPrice = this._selectedCoupons.length > 0 ? this._selectedCoupons.map(c => c.params.price).reduceRight((acc, val) => acc + val) : 0;
  }

  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
    this.windowSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
    this.purchasedSubscription.unsubscribe();
  }

}
