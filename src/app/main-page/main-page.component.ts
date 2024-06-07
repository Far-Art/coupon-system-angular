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

  private couponSub: Subscription;

  isHideOnScroll = false;

  private prevPosition = 0;

  private scrollDirection: 'up' | 'down';

  constructor(
      private couponsService: CouponsService,
      private scrollbar: ScrollbarService
  ) {}

  ngOnInit(): void {
    this.couponSub = this.couponsService.displayedCoupons$.subscribe(coupons => this.couponsNum = coupons.length);
    this.scrollbar.scrollPosition$().subscribe(pos => {
      if (pos.y % 10 === 0) {
        this.scrollDirection = pos.y > this.prevPosition ? 'down' : 'up';
        if (pos.y > 150) {
          this.prevPosition   = pos.y;
          this.isHideOnScroll = this.scrollDirection === 'down';
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.couponSub.unsubscribe();
  }
}
