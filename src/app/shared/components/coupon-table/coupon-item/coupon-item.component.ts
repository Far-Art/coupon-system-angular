import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Coupon} from '../../../models/coupon.model';
import {WindowSizeService} from '../../../services/window-size.service';
import {Subscription} from 'rxjs';


@Component({
  selector: 'cs-coupon-item',
  templateUrl: './coupon-item.component.html',
  styleUrls: ['./coupon-item.component.scss']
})
export class CouponItemComponent implements OnInit, OnDestroy {

  @Input() coupon: Coupon | null;

  @Input() index: number;

  @Input() options: { isChecked?: boolean, noCheckbox?: boolean } = {isChecked: false};

  @Input() isPurchased = false;

  @Input() isSaleEnded = false;

  @Output() onSelected = new EventEmitter<{ index: number, id: number }>();

  sliceVal: number;

  private subscription: Subscription;

  constructor(private windowSize: WindowSizeService, private changeDetector: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.subscription = this.windowSize.windowSize$.subscribe(size => {
      if (size.width > 550) {
        this.sliceVal = 45
      } else if (size.width > 500) {
        this.sliceVal = 40
      } else if (size.width > 450) {
        this.sliceVal = 35
      } else if (size.width > 400) {
        this.sliceVal = 30
      } else if (size.width > 350) {
        this.sliceVal = 25
      } else {
        this.sliceVal = 20
      }
      this.changeDetector.detectChanges();
    })
  }

  onCheck() {
    if (!this.options?.noCheckbox) {
      this.options.isChecked = !this.options.isChecked;
      this.onSelected.emit({index: this.index, id: this.coupon.params.id});
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
