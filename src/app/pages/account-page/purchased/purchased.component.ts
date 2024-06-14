import {Component, OnInit} from '@angular/core';
import {AccountService} from '../account.service';
import {Coupon} from '../../../shared/models/coupon.model';
import {CouponsService} from '../../../features/coupons/coupons.service';


@Component({
  selector: 'sc-purchased',
  templateUrl: './purchased.component.html',
  styleUrls: ['./purchased.component.scss']
})
export class PurchasedComponent implements OnInit {

  coupons: Coupon[]

  constructor(private accountService: AccountService, private couponsService: CouponsService) {}

  ngOnInit(): void {
    this.coupons = this.couponsService.getCouponsById(...this.accountService.user.couponsBought);
  }

}
