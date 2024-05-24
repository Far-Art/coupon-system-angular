import {Component, OnDestroy, OnInit} from '@angular/core';
import {CouponsService} from "../coupons.service";
import {Coupon} from "../../../shared/models/coupon.model";
import {Subscription} from "rxjs";

@Component({
  selector: 'cs-coupons-list',
  templateUrl: './coupons-list.component.html',
  styleUrls: ['./coupons-list.component.scss']
})
export class CouponsListComponent implements OnInit, OnDestroy {

  coupons: Coupon[] = [];

  private subscription!: Subscription;

  constructor(private couponService: CouponsService) {}

  ngOnInit(): void {
    this.subscription = this.couponService.coupons$().subscribe(list => this.coupons = list);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
