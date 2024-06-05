import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {Coupon} from '../../../../shared/models/coupon.model';
import {Subscription} from 'rxjs';
import {CouponsService} from '../../../../features/coupons/coupons.service';


@Component({
  selector: 'sc-coupon-table',
  templateUrl: './coupon-table.component.html',
  styleUrls: ['./coupon-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CouponTableComponent implements OnInit, OnDestroy {

  @Input() coupons: Coupon[] = [];

  @Output('selectedCoupons') selectedCouponsEmitter = new EventEmitter<Coupon[]>();

  readonly selectedCoupons = new Set<Coupon>();

  private couponsSub: Subscription;

  constructor(private couponsService: CouponsService, private changeDetector: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.couponsSub = this.couponsService.displayedCoupons$.subscribe(() => {
      this.changeDetector.detectChanges();
    });
  }

  onClick(coupon: Coupon) {
    if (this.selectedCoupons.has(coupon)) {
      this.selectedCoupons.delete(coupon);
    } else {
      this.selectedCoupons.add(coupon);
    }
    this.selectedCouponsEmitter.emit([...this.selectedCoupons]);
  }

  isPresent(coupon: Coupon): boolean {
    return this.selectedCoupons.has(coupon);
  }

  ngOnDestroy(): void {
    this.couponsSub.unsubscribe();
  }

}
