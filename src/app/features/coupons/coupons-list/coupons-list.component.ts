import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CouponsService} from '../coupons.service';
import {Coupon} from '../../../shared/models/coupon.model';
import {Subscription} from 'rxjs';


@Component({
  selector: 'cs-coupons-list',
  templateUrl: './coupons-list.component.html',
  styleUrls: ['./coupons-list.component.scss']
})
export class CouponsListComponent implements OnInit, OnDestroy {

  @Input() class: string;
  coupons: Coupon[] = [];
  private subscription: Subscription;

  constructor(private couponService: CouponsService) {}

  ngOnInit(): void {
    this.subscription = this.couponService.coupons$.subscribe(coupons => this.coupons = coupons);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
