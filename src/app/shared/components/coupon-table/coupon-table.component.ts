import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {Coupon} from '../../models/coupon.model';
import {Subscription} from 'rxjs';
import {CouponsService} from '../../../features/coupons/coupons.service';


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

  @Input() options: {
    selectAll?: boolean,
    noCheckbox?: boolean
  } = {}

  _indeterminateCheckBox = false

  readonly selectedCoupons = new Set<number>();

  private couponsSub: Subscription;

  constructor(private couponsService: CouponsService) {}

  ngOnInit(): void {
    if (this.options?.selectAll) {
      this._indeterminateCheckBox = true;
      this.selectAll();
      this.updateIndeterminateStatus();
    }
    this.emitSelected();
  }

  onCheckHandle(event: { index: number, id: number }) {
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

  has(id: number): boolean {
    return this.selectedCoupons.has(id);
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

  ngOnChanges(): void {
    this.selectedCoupons.clear();
    if (this.options?.selectAll) {
      this.coupons.map((coupon: Coupon) => coupon.params.id).forEach(id => this.selectedCoupons.add(id));
      this.emitSelected();
    }
    this.updateIndeterminateStatus();
  }

  ngOnDestroy(): void {
    if (this.couponsSub) this.couponsSub.unsubscribe();
  }

}
