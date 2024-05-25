import {Component, OnDestroy, OnInit} from '@angular/core';
import {CartService} from "./cart/cart.service";
import {WishListService} from "./wish-list/wish-list.service";
import {Subscription} from "rxjs";
import {FilterService} from "./filter/filter.service";

@Component({
  selector: 'sc-quick-actions',
  templateUrl: './quick-actions.component.html',
  styleUrls: ['./quick-actions.component.scss']
})
export class QuickActionsComponent implements OnInit, OnDestroy {

  cartBadgeVal: number   = 0;
  filterBadgeVal: number = 0;
  wishBadgeVal: number   = 0;

  isWishListVisible: boolean = false;

  private cartSubscription!: Subscription;
  private wishSubscription!: Subscription;


  constructor(
      private cartService: CartService,
      private wishListService: WishListService,
      private filterService: FilterService
  ) { }

  ngOnInit(): void {
    this.wishSubscription = this.wishListService.coupons$.subscribe(() => {
      this.wishBadgeVal = this.wishListService.couponsInWish;
    });
    this.cartSubscription = this.cartService.coupons$.subscribe(() => {
      this.cartBadgeVal = this.cartService.couponsInCart;
    });

  }

  onCartClick(): void {}

  onFilterClick(): void {}

  onWishListClick(): void {
    this.isWishListVisible = !this.isWishListVisible;
  }

  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
    this.wishSubscription.unsubscribe();
  }
}
