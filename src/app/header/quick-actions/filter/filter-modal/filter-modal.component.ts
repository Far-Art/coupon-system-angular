import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FilterService} from "../filter.service";
import {CouponsService} from "../../../../features/coupons/coupons.service";
import {take} from "rxjs";
import {Coupon} from "../../../../shared/models/coupon.model";

@Component({
  selector: 'sc-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss']
})
export class FilterModalComponent implements OnInit {

  @ViewChild('filterContent') private filterContent!: TemplateRef<any>;

  companyNamesList: string[] = [];

  constructor(private modalService: NgbModal, private filterService: FilterService, private couponsService: CouponsService) {}

  ngOnInit(): void {
    // this.wishSubscription = this.filterService.coupons$.subscribe(coupons => this.wishList = coupons);
  }

  openModal() {
    this.modalService.open(this.filterContent, {scrollable: true, modalDialogClass: 'top-5rem'});
  }

  private buildFilterLists() {
    // TODO think of merging those sets to map
    const companyNamesSet = new Set<string>();
    const endDateSet = new Set<string>();
    const categorySet = new Set<string>();
    const priceSet = new Set<string>();
    const freeSearchSet = new Set<string>();

    this.couponsService.coupons$().pipe(take(1)).subscribe(coupons => {
      coupons.forEach((coupon: Coupon) => {
        companyNamesSet.add(coupon.params.companyName);
      })
    })
  }

}
