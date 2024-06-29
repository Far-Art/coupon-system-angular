import {ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Coupon} from '../../models/coupon.model';
import {map, Subscription, take} from 'rxjs';
import {CouponsService} from '../../../features/coupons/coupons.service';
import {IdGeneratorService} from '../../services/id-generator.service';


@Component({
  selector: 'sc-coupon-table',
  templateUrl: './coupon-table.component.html',
  styleUrls: ['./coupon-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CouponTableComponent implements OnInit, OnChanges, OnDestroy {

  @ViewChild('indeterminateCheckBox') indeterminateCheckBoxRef: ElementRef;

  @Input() coupons: Coupon[] = [];

  @Output('selectedCoupons') selectedCouponsEmitter = new EventEmitter<Coupon[]>();

  randomId: string;

  @Input() options: {
    selectAll?: boolean,
    noCheckbox?: boolean
  } = {}

  _indeterminateCheckBox = false

  readonly selectedCoupons = new Set<string>();

  private couponsSub: Subscription;

  constructor(private couponsService: CouponsService, private idGenerator: IdGeneratorService) {}

  ngOnInit(): void {
    this.randomId = this.idGenerator.generate();
    if (this.options?.selectAll) {
      this._indeterminateCheckBox = true;
      this.selectAll();
      this.updateIndeterminateStatus();
    }
    this.emitSelected();
  }

  onCheckHandle(event: { index: number, id: string }) {
    this.selectedCoupons.has(event.id) ? this.selectedCoupons.delete(event.id) : this.selectedCoupons.add(event.id);
    this.updateIndeterminateStatus();
    this.emitSelected();
  }

  onIndeterminateClick() {
    if (this.selectedCoupons.size === this.coupons.length) {
      this.unselectAll();
    } else {
      this.selectAll();
    }
    this.updateIndeterminateStatus();
  }

  isPurchased(coupon: Coupon) {
    return this.couponsService.purchasedCoupons$.pipe(take(1), map(ids => ids.includes(coupon.params.id)));
  }

  isSaleEnded(coupon: Coupon) {
    return coupon.params.isSaleEnded;
  }

  has(id: string): boolean {
    return this.selectedCoupons.has(id);
  }

  ngOnChanges(): void {
    this.selectedCoupons.clear();
    if (this.options?.selectAll) {
      this.coupons.map((coupon: Coupon) => coupon.params.id).forEach(id => this.selectedCoupons.add(id));
      this.emitSelected();
    }
    this.updateIndeterminateStatus();
  }

  private updateIndeterminateStatus() {
    const button = this.indeterminateCheckBoxRef?.nativeElement;

    if (button) {
      const total    = this.coupons.length;
      const selected = this.selectedCoupons.size;

      if (selected === total) {
        this._indeterminateCheckBox = true;
        button.indeterminate        = false;
      } else if (selected > 0) {
        this._indeterminateCheckBox = false;
        button.indeterminate        = true;
      } else {
        this._indeterminateCheckBox = false;
        button.indeterminate        = false;
      }
    }
  }

  private selectAll() {
    this.coupons.forEach(c => this.selectedCoupons.add(c.params.id));
    this.emitSelected();
  }

  private unselectAll() {
    this.selectedCoupons.clear();
    this.emitSelected();
  }

  private emitSelected() {
    this.selectedCouponsEmitter.emit(this.couponsService.getCouponsById(...this.selectedCoupons));
  }

  ngOnDestroy(): void {
    if (this.couponsSub) this.couponsSub.unsubscribe();
  }

}
