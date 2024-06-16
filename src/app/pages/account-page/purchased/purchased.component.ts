import {Component, OnInit} from '@angular/core';
import {AccountService} from '../account.service';
import {Coupon} from '../../../shared/models/coupon.model';
import {CouponsService} from '../../../features/coupons/coupons.service';
import {DataManagerService} from '../../../shared/services/data-manager.service';
import {concatMap, take} from 'rxjs';


@Component({
  selector: 'sc-purchased',
  templateUrl: './purchased.component.html',
  styleUrls: ['./purchased.component.scss']
})
export class PurchasedComponent implements OnInit {

  coupons: Coupon[]

  constructor(
      private accountService: AccountService,
      private couponsService: CouponsService,
      private dataManager: DataManagerService
  ) {}

  ngOnInit(): void {
    this.accountService.user$.pipe(take(1)).subscribe(user => {
      this.coupons = this.couponsService.getCouponsById(...user.couponsBought || []);
    });
  }

  onPurchaseClear() {
    this.accountService.user$.pipe(
        take(1),
        concatMap(user => this.dataManager.putUserData(user.userId, user).pipe(take(1)))
    ).subscribe({
      next: () => this.coupons.length = 0,
      error: err => {},
      complete: () => this.coupons.length = 0
    });
  }

}
