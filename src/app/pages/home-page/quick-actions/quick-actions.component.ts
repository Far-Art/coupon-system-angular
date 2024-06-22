import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {CouponsService} from '../../../features/coupons/coupons.service';
import {FilterService} from './modals/filter/filter.service';


@Component({
  selector: 'sc-quick-actions',
  templateUrl: './quick-actions.component.html',
  styleUrls: ['./quick-actions.component.scss']
})
export class QuickActionsComponent implements OnInit, OnDestroy {

  cartBadgeVal: number   = 0;
  filterBadgeVal: string = '';
  wishBadgeVal: number   = 0;

  private wishSubscription: Subscription;
  private filterSubscription: Subscription;
  private cartSubscription: Subscription;

  constructor(
      private filterService: FilterService,
      private couponsService: CouponsService
  ) { }

  ngOnInit(): void {
    this.wishSubscription   = this.couponsService.wishIds$.subscribe(() => this.wishBadgeVal = this.couponsService.couponsInWish);
    this.filterSubscription = this.filterService.filteredCoupons$.subscribe(() => this.filterBadgeVal = this.filterService.getFiltersBadgeValue);
    this.cartSubscription   = this.couponsService.cartIds$.subscribe(() => this.cartBadgeVal = this.couponsService.couponsInCart);
  }

  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
    this.wishSubscription.unsubscribe();
    this.filterSubscription.unsubscribe();
  }

}
