import {Component, OnDestroy, OnInit} from '@angular/core';
import {LogoService} from './logo.service';
import {Subscription} from 'rxjs';
import {CouponsService} from '../features/coupons/coupons.service';


@Component({
  selector: 'cs-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  constructor(private logoService: LogoService, private couponsService: CouponsService) {}

  private couponSub: Subscription;
  private logoSub: Subscription;

  isBlinked  = false;
  couponsNum = 0

  ngOnInit(): void {
    this.logoSub   = this.logoService.blinked$.subscribe(() => this.logoBlink());
    this.couponSub = this.couponsService.displayedCoupons$.subscribe(coupons => this.couponsNum = coupons.length);
  }

  ngOnDestroy(): void {
    this.couponSub.unsubscribe();
    this.logoSub.unsubscribe();
  }

  private logoBlink() {
    this.isBlinked = true;
    setTimeout(() => this.isBlinked = false, 300);
  }

}
