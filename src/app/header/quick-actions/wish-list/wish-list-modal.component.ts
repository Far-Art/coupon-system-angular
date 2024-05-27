import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Coupon} from "../../../shared/models/coupon.model";
import {WishListService} from "./wish-list.service";
import {Subscription} from "rxjs";
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'sc-wish-list-modal',
  templateUrl: './wish-list-modal.component.html',
  styleUrls: ['./wish-list-modal.component.scss']
})
export class WishListModalComponent implements OnInit, OnDestroy {

  wishList: Coupon[] = [];

  @ViewChild('wishContent') private wishContent!: TemplateRef<any>;

  private wishSubscription!: Subscription;

  constructor(private wishListService: WishListService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.wishSubscription = this.wishListService.coupons$.subscribe(coupons => this.wishList = coupons);
  }

  openModal() {
    this.modalService.open(this.wishContent, {scrollable: true, modalDialogClass: 'top-5rem'});
  }

  ngOnDestroy(): void {
    this.wishSubscription.unsubscribe();
  }

}
