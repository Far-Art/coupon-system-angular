import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CartService} from "./cart/cart.service";
import {WishListService} from "./wish-list/wish-list.service";
import {Subscription} from "rxjs";
import {FilterService} from "./filter/filter.service";
import {WishListModalComponent} from "./wish-list/wish-list-modal.component";
import {CartModalComponent} from "./cart/cart-modal.component";
import {FilterModalComponent} from "./filter/filter-modal.component";

@Component({
  selector: 'sc-quick-actions',
  templateUrl: './quick-actions.component.html',
  styleUrls: ['./quick-actions.component.scss']
})
export class QuickActionsComponent implements OnInit, OnDestroy {

  cartBadgeVal: number   = 0;
  filterBadgeVal: number = 0;
  wishBadgeVal: number   = 0;

  @ViewChild('wishModal') wishModal     = ElementRef<any>;
  @ViewChild('filterModal') filterModal = ElementRef<any>;
  @ViewChild('cartModal') cartModal     = ElementRef<any>;

  private wishSubscription!: Subscription;
  private filterSubscription!: Subscription;
  private cartSubscription!: Subscription;

  constructor(
      private cartService: CartService,
      private wishListService: WishListService,
      private filterService: FilterService
  ) { }

  ngOnInit(): void {
    this.wishSubscription   = this.wishListService.coupons$.subscribe(() => this.wishBadgeVal = this.wishListService.couponsInWish);
    this.cartSubscription   = this.cartService.coupons$.subscribe(() => this.cartBadgeVal = this.cartService.couponsInCart);
    this.filterSubscription = this.filterService.filteredCoupons$.subscribe(() => this.filterBadgeVal = this.filterService.filtersApplied);
  }

  onCartClick(): void {
    (this.cartModal as unknown as CartModalComponent).openModal();
  }

  onFilterClick(): void {
    (this.filterModal as unknown as FilterModalComponent).openModal();
  }

  onWishListClick(): void {
    (this.wishModal as unknown as WishListModalComponent).openModal();
  }

  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
    this.wishSubscription.unsubscribe();
    this.filterSubscription.unsubscribe();
  }
}
