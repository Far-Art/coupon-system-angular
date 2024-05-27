import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FilterKeys, FilterService} from "./filter.service";
import {CouponsService} from "../../../features/coupons/coupons.service";
import {Subscription} from "rxjs";
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'sc-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss'],
  animations: [
    trigger('fade', [
      transition(':enter', [
        animate('300ms ease', style({opacity: 1})),
      ]),
      transition(':leave', [
        animate('300ms ease', style({opacity: 0})),
      ])
    ]),
  ]
})
export class FilterModalComponent implements OnInit, OnDestroy {

  @ViewChild('filterContent') private filterContent!: TemplateRef<any>;

  private couponSub!: Subscription;
  private filtersSub!: Subscription;

  filtersKeyValue: FilterKeys = {
    categories: ['Vegetables', 'Automotive', 'Electronics'],
    companyNames: ['Adidas', 'Volvo', 'M3', 'Home Depot'],
    priceRange: {start: 100, end: 1000},
    dateRange: {start: new Date(), end: new Date(new Date().setMonth(new Date().getMonth() + 2))}
  };
  appliedFilters: FilterKeys  = {};

  isCategoriesCollapsed = false;
  isCompaniesCollapsed  = true;
  isPriceCollapsed      = true;
  isDateCollapsed       = true;

  constructor(
      private modalService: NgbModal,
      private filterService: FilterService,
      private couponsService: CouponsService
  ) {}

  ngOnInit(): void {
    this.couponSub = this.couponsService.coupons$.subscribe(coupons => {
      this.filterService.rebuildFilters(coupons);
    });

    this.filtersSub = this.filterService.filteredCoupons$.subscribe(coupons => {
      this.filtersKeyValue = this.filterService.filtersToDisplay;
      // this.filterService.rebuildFilters(coupons);
    });
  }

  openModal() {
    this.isCategoriesCollapsed = false;
    this.isCompaniesCollapsed  = true;
    this.isPriceCollapsed      = true;
    this.isDateCollapsed       = true;
    this.modalService.open(this.filterContent, {scrollable: true, modalDialogClass: 'top-5rem', backdropClass:'blur'});
  }

  applyFilters() {
    // TODO replace with real object after building form
    const tempFilters: FilterKeys = {};
    this.filterService.applyFilters(tempFilters);
  }

  onReset() {

  }

  ngOnDestroy(): void {
    this.couponSub.unsubscribe();
    this.filtersSub.unsubscribe();
  }

}
