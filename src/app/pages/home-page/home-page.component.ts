import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {CouponsService} from '../../features/coupons/coupons.service';
import {translateInOut} from '../../shared/animations/translateInOut.animation';
import {ScrollService} from '../../shared/services/scroll.service';


@Component({
  selector: 'cs-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  animations: [translateInOut(300)]
})
export class HomePageComponent implements OnInit, OnDestroy {

  couponsNum     = 0
  isHideOnScroll = false;

  private couponSub: Subscription;
  private scrollSub: Subscription;

  constructor(
      private couponsService: CouponsService,
      private scrollbar: ScrollService
  ) {}

  ngOnInit(): void {
    this.couponSub = this.couponsService.coupons$.subscribe(coupons => this.couponsNum = coupons.length);
    this.scrollSub = this.scrollbar.scrollPosition$().subscribe(event => {
      this.isHideOnScroll = !(event.scrollDirection === 'top' || event.scrollDirection === 'up');
    });
  }

  ngOnDestroy(): void {
    this.couponSub.unsubscribe();
    this.scrollSub.unsubscribe();
  }
}
