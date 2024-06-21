import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
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

  @ViewChild('cartModal') private cartModal: TemplateRef<any>;

  cartList: Coupon[] = [];

  readonly _selectedCoupons: Coupon[] = [];

  totalPrice: number;

  _windowWidth: number;

  _switchWidth = 576;

  isUserPresent: boolean;

  isLoading = false;

  errorMessage: string;

  private modal: NgbModalRef = null;

  private cartSubscription: Subscription;
  private windowSubscription: Subscription;
  private userSubscription: Subscription;
  private purchasedSubscription: Subscription;

  constructor(
      private modalService: NgbModal,
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

  openModal() {
    this.updatePrice();
    this.modal = this.modalService
        .open(this.cartModal,
            {
              scrollable: true,
              modalDialogClass: '',
              beforeDismiss: () => {
                this._selectedCoupons.length = 0;
                this.errorMessage            = null;
                this.cartService.updateUserCart(this._selectedCoupons);
                return true;
              }
            });
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
    this.closeIfEmpty();
  }

  onMove() {
    this.couponsService.moveToWish(...this._selectedCoupons);
    this.onCancel();
    this.closeIfEmpty();
  }

  onBuy() {
    this.errorMessage = null;
    if (this._selectedCoupons.length > 0) {
      this.isLoading = true;
      this.cartService.buyCoupons$(this._selectedCoupons).pipe(
          delay(1000)
      ).subscribe({
        next: () => {
          this.closeIfEmpty();
          this.isLoading = false;
        }, error: (err: Error) => {
          this.isLoading    = false;
          this.errorMessage = err.message;
        }
      });
    }
  }

  private closeIfEmpty(): void {
    if (this.cartList.length === 0) {
      this.modal.close();
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
