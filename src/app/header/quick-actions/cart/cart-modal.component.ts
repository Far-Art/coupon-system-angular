import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Coupon} from '../../../shared/models/coupon.model';
import {delay, Subscription, tap} from 'rxjs';
import {CouponsService} from '../../../features/coupons/coupons.service';
import {CartService} from './cart.service';
import {WindowSizeService} from '../../../shared/services/window-size.service';


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

  private modal: NgbModalRef = null;

  private cartSubscription: Subscription;
  private windowSubscription: Subscription;
  private userSubscription: Subscription;

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

    this.userSubscription = this.cartService.isUserPresent$().subscribe(isPresent => this.isUserPresent = isPresent);
  }

  openModal() {
    this.updatePrice();
    this.modal = this.modalService
        .open(this.cartModal,
            {
              scrollable: true,
              modalDialogClass: '',
              beforeDismiss: () => {
                this.onCancel();
                return true;
              }
            });
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
    this.closeIfEmpty();
  }

  onMove() {
    this.couponsService.moveToWish(...this._selectedCoupons);
    this.onCancel();
    this.closeIfEmpty();
  }

  onBuy() {
    // TODO buying coupons does not update badge and disabled status of button
    if (this._selectedCoupons.length > 0) {
      this.isLoading = true;
      this.cartService.buyCoupons$(this.cartList).pipe(delay(1000), tap(() => this.isLoading = false)).subscribe(bought => {
        this.cartList = this.cartList.filter(coupon => !bought.includes(coupon.params.id));
        this.closeIfEmpty();
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
  }

}
