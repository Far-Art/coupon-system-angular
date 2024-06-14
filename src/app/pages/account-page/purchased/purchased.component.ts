import {Component, OnInit} from '@angular/core';
import {AccountService} from '../account.service';
import {Coupon} from '../../../shared/models/coupon.model';
import {CouponsService} from '../../../features/coupons/coupons.service';
import {DataManagerService} from '../../../shared/services/data-manager.service';
import {take} from 'rxjs';


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
    this.coupons = this.couponsService.getCouponsById(...this.accountService.user?.couponsBought || []);
  }

  onPurchaseClear() {
    const user                = this.accountService.user;
    user.couponsBought.length = 0
    this.dataManager.putUserData(this.accountService.userId, user).pipe(take(1))
        .subscribe(() => {
          this.coupons.length = 0;
        });
  }

}
