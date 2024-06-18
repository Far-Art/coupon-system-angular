import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {FilterService} from './filter/filter.service';
import {WishListModalComponent} from './wish-list/wish-list-modal.component';
import {CartModalComponent} from './cart/cart-modal.component';
import {FilterModalComponent} from './filter/filter-modal.component';
import {CouponsService} from '../../features/coupons/coupons.service';


@Component({
  selector: 'sc-quick-actions',
  templateUrl: './quick-actions.component.html',
  styleUrls: ['./quick-actions.component.scss']
})
export class QuickActionsComponent implements OnInit, OnDestroy {

  cartBadgeVal: number   = 0;
  filterBadgeVal: string = '';
  wishBadgeVal: number   = 0;

  @ViewChild('wishModal', {static: true}) wishModal     = ElementRef<WishListModalComponent>;
  @ViewChild('filterModal', {static: true}) filterModal = ElementRef<FilterModalComponent>;
  @ViewChild('cartModal', {static: true}) cartModal     = ElementRef<CartModalComponent>;

  private wishSubscription: Subscription;
  private filterSubscription: Subscription;
  private cartSubscription: Subscription;

  constructor(
      private filterService: FilterService,
      private couponsService: CouponsService
  ) { }

  ngOnInit(): void {
    // set timeout to avoid error of value changed after view checked
    setTimeout(() => {
      this.wishSubscription   = this.couponsService.wishIds$.subscribe(() => this.wishBadgeVal = this.couponsService.couponsInWish);
      this.filterSubscription = this.filterService.filteredCoupons$.subscribe(() => this.filterBadgeVal = this.filterService.getFiltersBadgeValue);
      this.cartSubscription   = this.couponsService.cartIds$.subscribe(() => this.cartBadgeVal = this.couponsService.couponsInCart);
    }, 0);
  }

  onCartClick(): void {
    (this.cartModal as any as CartModalComponent).openModal();
  }

  onFilterClick(): void {
    (this.filterModal as any as FilterModalComponent).openModal();
  }

  onWishListClick(): void {
    (this.wishModal as any as WishListModalComponent).openModal();
  }

  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
    this.wishSubscription.unsubscribe();
    this.filterSubscription.unsubscribe();
  }

}
