import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Coupon} from '../../../shared/models/coupon.model';
import {Subscription} from 'rxjs';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {CouponsService} from '../../../features/coupons/coupons.service';


@Component({
  selector: 'sc-wish-list-modal',
  templateUrl: './wish-list-modal.component.html',
  styleUrls: ['./wish-list-modal.component.scss']
})
export class WishListModalComponent implements OnInit, OnDestroy {

  @ViewChild('wishModal') private wishContent: TemplateRef<any>;

  wishList: Coupon[] = [];

  selectedCoupons: Coupon[];

  private modal: NgbModalRef = null;

  private wishSubscription!: Subscription;

  constructor(private couponsService: CouponsService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.wishSubscription = this.couponsService.couponsInWish$
        .subscribe(data => {
          this.wishList = data.coupons;
        });
  }

  openModal() {
    if (this.wishList.length > 0) {
      this.modal = this.modalService.open(this.wishContent, {scrollable: true, modalDialogClass: ''});
    }
  }

  onCouponsSelected(coupons: Coupon[]) {
    this.selectedCoupons.push(...coupons);
  }

  onCancel() {
    this.selectedCoupons = [];
  }

  onDelete() {
    this.couponsService.removeFromWish(this.selectedCoupons);
    this.onCancel();
    this.closeIfEmpty();
  }

  onMove() {
    this.couponsService.moveToCart(this.selectedCoupons);
    this.onCancel();
    this.closeIfEmpty();
  }

  private closeIfEmpty(): void {
    if (this.wishList.length === 0) {
      this.modal.close();
    }
  }

  ngOnDestroy(): void {
    this.wishSubscription.unsubscribe();
  }

}
