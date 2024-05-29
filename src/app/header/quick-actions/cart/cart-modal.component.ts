import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Coupon} from "../../../shared/models/coupon.model";
import {Subscription} from "rxjs";
import {CouponsService} from "../../../features/coupons/coupons.service";

@Component({
  selector: 'sc-cart-modal',
  templateUrl: './cart-modal.component.html',
  styleUrls: ['./cart-modal.component.scss']
})
export class CartModalComponent implements OnInit, OnDestroy {

  cartList: Coupon[] = [];

  @ViewChild('cartContent') private cartContent!: TemplateRef<any>;

  private cartSubscription!: Subscription;

  constructor(
      private modalService: NgbModal,
      private couponService: CouponsService
  ) {}

  ngOnInit(): void {
    // TODO change to proper subscription after test
    // this.cartSubscription = this.cartService.coupons$.subscribe(coupons => this.cartList = coupons);
    this.couponService.displayedCoupons$.subscribe(coupons => this.cartList = coupons);
  }

  openModal() {
    this.modalService.open(this.cartContent, {scrollable: true, modalDialogClass: 'top-5rem'});
  }

  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
  }

}
