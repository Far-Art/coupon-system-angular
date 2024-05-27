import {Component, Input, QueryList, ViewChildren} from '@angular/core';
import {Coupon} from "../../../../shared/models/coupon.model";
import {NgbdSortableHeader, SortEvent} from "../../../../shared/directives/sortable.directive";

@Component({
  selector: 'sc-coupon-table',
  templateUrl: './coupon-table.component.html',
  styleUrls: ['./coupon-table.component.scss']
})
export class CouponTableComponent {

  @Input() coupons: Coupon[] = [];

  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    // this.service.sortColumn = column;
    // this.service.sortDirection = direction;
  }
}
