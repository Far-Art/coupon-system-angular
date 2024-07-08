import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {CouponsService} from '../../features/coupons/coupons.service';
import {ScrollbarService} from '../../shared/services/scrollbar.service';
import {TranslateInOut} from '../../shared/animations/translateInOut.animation';


@Component({
  selector: 'cs-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  animations: [TranslateInOut(300)]
})
export class HomePageComponent implements OnInit, OnDestroy {

  couponsNum     = 0
  isHideOnScroll = false;

  private couponSub: Subscription;
  private scrollSub: Subscription;

  constructor(
      private couponsService: CouponsService,
      private scrollbar: ScrollbarService
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
