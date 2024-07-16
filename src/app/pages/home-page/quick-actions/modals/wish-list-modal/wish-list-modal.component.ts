import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription, take} from 'rxjs';
import {CouponsService} from '../../../../../features/coupons/coupons.service';
import {WindowSizeService} from '../../../../../shared/services/window-size.service';
import {Coupon} from '../../../../../shared/models/coupon.model';
import {ModalService} from '../../../../../shared/components/modal/modal.service';


@Component({
  selector: 'sc-wish-list-modal',
  templateUrl: './wish-list-modal.component.html',
  styleUrls: ['./wish-list-modal.component.scss']
})
export class WishListModalComponent implements OnInit, OnDestroy {

  wishList: Coupon[] = [];

  selectedCoupons: Coupon[] = [];

  isAnySaleEnded: boolean = false;

  isAnyPurchased: boolean = false;

  _windowWidth: number;

  _switchWidth = 576;

  private wishSubscription: Subscription;
  private windowSubscription: Subscription;

  constructor(
      private couponsService: CouponsService,
      private windowSize: WindowSizeService,
      private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.windowSubscription = this.windowSize.windowSize$
                                  .subscribe(size => this._windowWidth = size.width)

    this.wishSubscription = this.couponsService.wishIds$
                                .subscribe(ids => {
                                  this.wishList = this.couponsService.getCouponsById(...ids);
                                  if (this.wishList.length === 0) {
                                    this.modalService.close();
                                  }
                                });
  }

  onCouponsSelected(coupons: Coupon[]): void {
    this.couponsService.purchasedCoupons$.pipe(take(1)).subscribe(purchased => {
      this.selectedCoupons = coupons;
      this.isAnySaleEnded  = coupons.some(c => c.params.isSaleEnded);
      this.isAnyPurchased  = coupons.some(c => purchased.some(id => id === c.params.id));
    })
  }

  onCancel() {
    this.selectedCoupons = [];
  }

  onDelete() {
    this.couponsService.removeFromWish(...this.selectedCoupons);
    this.onCancel();
  }

  onMove() {
    this.couponsService.moveToCart(...this.selectedCoupons.filter(c => !c.params.isSaleEnded));
    this.onCancel();
  }

  ngOnDestroy(): void {
    this.wishSubscription.unsubscribe();
    this.windowSubscription.unsubscribe();
  }

}
