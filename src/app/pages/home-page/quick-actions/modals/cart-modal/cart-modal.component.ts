import {Component, OnDestroy, OnInit} from '@angular/core';
import {delay, Subscription} from 'rxjs';
import {CartService} from './cart.service';
import {Coupon} from '../../../../../shared/models/coupon.model';
import {CouponsService} from '../../../../../features/coupons/coupons.service';
import {WindowSizeService} from '../../../../../shared/services/window-size.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ModalService} from '../../../../../shared/components/modal/modal.service';


@Component({
  selector: 'sc-cart-modal',
  templateUrl: './cart-modal.component.html',
  styleUrls: ['./cart-modal.component.scss']
})
export class CartModalComponent implements OnInit, OnDestroy {

  readonly cartModalId  = 'cartModal';
  readonly guestModalId = 'guestCheckoutModal';

  guestForm: FormGroup<{ email: FormControl<string>, name: FormControl<string> }>;

  cartList: Coupon[] = [];

  readonly _selectedCoupons: Coupon[] = [];

  totalPrice: number;

  _windowWidth: number;

  _switchWidth = 576;

  isUserPresent: boolean;

  isLoading = false;

  isMoveToWish: boolean = true;

  errorMessage: string;

  private cartSubscription: Subscription;
  private windowSubscription: Subscription;
  private userSubscription: Subscription;

  constructor(
      private couponsService: CouponsService,
      private cartService: CartService,
      private windowSize: WindowSizeService,
      private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.guestForm = this.initGuestForm();

    this.windowSubscription = this.windowSize.windowSize$.subscribe(size => {
      this._windowWidth = size.width;
    })

    this.cartSubscription = this.couponsService.cartIds$.subscribe(ids => {
      this.cartList = this.couponsService.getCouponsById(...ids);
    });

    this.userSubscription = this.cartService.isUserPresent$().subscribe(isPresent => this.isUserPresent = isPresent);
  }

  onCouponsSelected(coupons: Coupon[]) {
    this._selectedCoupons.length = 0
    this._selectedCoupons.push(...coupons);
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
      this.cartService.buyCoupons$(this._selectedCoupons, {moveToWIsh: this.isMoveToWish}).pipe(
          delay(1500)
      ).subscribe({
        next: () => {
          if (this.cartList.length === 0) {
            this.modalService.close();
          } else if (!this.isUserPresent) {
            this.modalService.open(this.cartModalId);
          }
          this.isLoading = false;
        }, error: (err: Error) => {
          this.isLoading    = false;
          this.errorMessage = err.message;
        }
      });
    }
  }

  onMoveToWishCheckboxClick() {
    this.isMoveToWish = !this.isMoveToWish;
  }

  onCloseModal = () => {
    this.errorMessage = null;
  }

  private updatePrice() {
    this.totalPrice = this._selectedCoupons.length > 0 ? this._selectedCoupons.map(c => c.params.price).reduceRight((acc, val) => acc + val) : 0;
  }

  private initGuestForm() {
    return new FormGroup({
      email: new FormControl<string>(null, [Validators.required, Validators.email]),
      name: new FormControl<string>(null, [Validators.required, Validators.minLength(3)])
    })
  }

  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
    this.windowSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

}
