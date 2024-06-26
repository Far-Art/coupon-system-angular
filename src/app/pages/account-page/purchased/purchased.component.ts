import {Component, OnInit} from '@angular/core';
import {AccountService} from '../account.service';
import {Coupon} from '../../../shared/models/coupon.model';
import {CouponsService} from '../../../features/coupons/coupons.service';
import {DataManagerService} from '../../../shared/services/data-manager.service';
import {concatMap, take, tap} from 'rxjs';


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
      this.coupons = this.couponsService.getCouponsById(...user.couponsPurchased || []);
    });
  }

  onPurchaseClear() {
    this.accountService.user$.pipe(
        take(1),
        tap(user => user.couponsPurchased.length = 0),
        concatMap(user => this.dataManager.putUserData(user.authData.localId, user).pipe(take(1))),
        tap(user => this.accountService.updateUser(user))
    ).subscribe({
      next: () => {
        this.coupons.length = 0;
      },
      error: () => {},
      complete: () => {
        this.coupons.length = 0;
      }
    });
  }

}
