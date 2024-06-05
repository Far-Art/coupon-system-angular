import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Coupon} from '../../../shared/models/coupon.model';
import {Subscription} from 'rxjs';
import {CouponsService} from '../../../features/coupons/coupons.service';
import {FormGroup} from '@angular/forms';


@Component({
  selector: 'sc-cart-modal',
  templateUrl: './cart-modal.component.html',
  styleUrls: ['./cart-modal.component.scss']
})
export class CartModalComponent implements OnInit, OnDestroy {

  @ViewChild('cartModal') private cartContent: TemplateRef<any>;

  cartForm: FormGroup;

  cartList: Coupon[] = [];

  selectedCoupons: Coupon[] = [];

  totalPrice: number;

  private modal: NgbModalRef = null;

  private cartSubscription!: Subscription;

  constructor(
      private modalService: NgbModal,
      private couponsService: CouponsService
  ) {}

  ngOnInit(): void {
    this.cartSubscription = this.couponsService.couponsInCart$.subscribe(data => {
      this.cartList   = data.coupons;
      this.totalPrice = this.cartList.length > 0 ? this.cartList.map(c => c.params.price).reduceRight((acc, val) => acc + val) : 0;
    });
  }

  openModal() {
    this.modal = this.modalService.open(this.cartContent, {scrollable: true, modalDialogClass: ''});
  }

  onCouponsSelect(coupons: Coupon[]) {
    this.selectedCoupons = coupons;
  }

  onCancel() {
    this.selectedCoupons = [];
  }

  onDelete() {
    this.couponsService.removeFromCart(this.selectedCoupons);
    this.onCancel();
    this.closeIfEmpty();
  }

  onMove() {
    this.couponsService.moveToWish(this.selectedCoupons);
    this.onCancel();
    this.closeIfEmpty();
  }

  onBuy() {

  }

  private closeIfEmpty(): void {
    if (this.cartList.length === 0) {
      this.modal.close();
    }
  }

  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
  }

}
