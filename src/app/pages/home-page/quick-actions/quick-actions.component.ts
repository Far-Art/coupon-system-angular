import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {CouponsService} from '../../../features/coupons/coupons.service';
import {FilterService} from './modals/filter-modal/filter.service';


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
    this.wishSubscription   = this.couponsService.wishIds$.subscribe(ids => this.wishBadgeVal = ids.length);
    this.filterSubscription = this.filterService.filters$.subscribe(filters => this.filterBadgeVal = filters.badge);
    this.cartSubscription   = this.couponsService.cartIds$.subscribe(ids => this.cartBadgeVal = ids.length);
  }

  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
    this.wishSubscription.unsubscribe();
    this.filterSubscription.unsubscribe();
  }

}
