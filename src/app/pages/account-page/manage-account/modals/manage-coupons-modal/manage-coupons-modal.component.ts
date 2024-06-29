import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../../../../auth/auth.service';
import {concatMap, map, Subscription, take} from 'rxjs';
import {CouponsService} from '../../../../../features/coupons/coupons.service';
import {Coupon} from '../../../../../shared/models/coupon.model';


@Component({
  selector: 'cs-manage-coupons-modal',
  templateUrl: './manage-coupons-modal.component.html',
  styleUrls: ['./manage-coupons-modal.component.scss']
})
export class ManageCouponsModalComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  coupons: Coupon[] = [];

  constructor(
      private authService: AuthService,
      private couponsService: CouponsService
  ) {}

  ngOnInit(): void {
    this.subscription = this.couponsService.initialCoupons$.pipe(
        concatMap(() => this.authService.user$.pipe(take(1), map(user => user.email))),
        map(email => this.couponsService.findCoupons(coupon => coupon.params.companyEmail === email))
    ).subscribe(coupons => {
      this.coupons = coupons;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
