import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {CouponsService} from '../features/coupons/coupons.service';
import {ScrollbarService} from '../shared/services/scrollbar.service';
import {animate, style, transition, trigger} from '@angular/animations';


@Component({
  selector: 'cs-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  animations: [
    trigger('offPage', [
      transition(':enter',
          [
            style({opacity: 0, transform: 'translateY(-100%)'}),
            animate('300ms linear', style({opacity: 1, transform: 'translateY(0)'}))
          ]),
      transition(':leave',
          [
            style({opacity: 1, transform: 'translateY(0)'}),
            animate('300ms linear', style({opacity: 0, transform: 'translateY(-100%)'}))
          ])
    ])
  ]
})
export class MainPageComponent implements OnInit, OnDestroy {

  couponsNum = 0
  isHideOnScroll = false;

  private couponSub: Subscription;
  private scrollSub: Subscription;

  constructor(
      private couponsService: CouponsService,
      private scrollbar: ScrollbarService
  ) {}

  ngOnInit(): void {
    this.couponSub = this.couponsService.displayedCoupons$.subscribe(coupons => this.couponsNum = coupons.length);
    this.scrollSub = this.scrollbar.scrollPosition$().subscribe(event => {
      if (event.y > 150) {
        this.isHideOnScroll = event.scrollDirection === 'down';
      }
    });
  }

  ngOnDestroy(): void {
    this.couponSub.unsubscribe();
    this.scrollSub.unsubscribe();
  }
}
