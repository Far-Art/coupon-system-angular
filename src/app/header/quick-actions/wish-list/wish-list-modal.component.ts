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

  @ViewChild('wishModal') private wishModal: TemplateRef<any>;

  wishList: Coupon[] = [];

  selectedCoupons: Coupon[] = [];

  isAnySaleEnded: boolean = false;

  private modal: NgbModalRef = null;

  private wishSubscription: Subscription;

  constructor(private couponsService: CouponsService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.wishSubscription = this.couponsService.wishIds$
        .subscribe(ids => this.wishList = this.couponsService.getCouponsById(...ids));
  }

  openModal() {
    if (this.wishList.length > 0) {
      this.modal = this.modalService.open(this.wishModal, {scrollable: true, modalDialogClass: ''});
    }
  }

  onCouponsSelected(coupons: Coupon[]) {
    this.selectedCoupons = coupons;
    this.isAnySaleEnded  = coupons.some(c => c.params.isSaleEnded);
  }

  onCancel() {
    this.selectedCoupons = [];
  }

  onDelete() {
    this.couponsService.removeFromWish(...this.selectedCoupons);
    this.onCancel();
    this.closeIfEmpty();
  }

  onMove() {
    this.couponsService.moveToCart(...this.selectedCoupons.filter(c => !c.params.isSaleEnded));
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
