import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Coupon} from "../../../../shared/models/coupon.model";
import {WishListService} from "../wish-list.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'sc-wish-list-modal',
  templateUrl: './wish-list-modal.component.html',
  styleUrls: ['./wish-list-modal.component.scss']
})
export class WishListModalComponent implements OnInit, OnDestroy {
  wishList: Coupon[] = [];

  @Input() id!: string;

  private wishSubscription!: Subscription;

  constructor(private wishListService: WishListService) {}

  ngOnInit(): void {
    this.wishSubscription = this.wishListService.coupons$.subscribe(coupons => this.wishList = coupons);
  }

  ngOnDestroy(): void {
    this.wishSubscription.unsubscribe();
  }

}
