import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FilterKeys, FilterService} from "./filter.service";
import {CouponsService} from "../../../features/coupons/coupons.service";
import {Subscription} from "rxjs";
import {animate, style, transition, trigger} from "@angular/animations";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

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

  @ViewChild('filterContent', {static: true}) private filterContent: TemplateRef<any>;

  private couponSub: Subscription;
  private filtersSub: Subscription;

  filtersKeyValue: FilterKeys;

  appliedFilters: FilterKeys;

  form: FormGroup<{
    dateRange: FormGroup<{ start: FormControl<Date | undefined | null>; end: FormControl<Date | undefined | null> }>;
    freeText: FormControl<string | undefined | null>;
    categories: FormArray<any>;
    priceRange: FormGroup<{
      start: FormControl<number | undefined | null>;
      end: FormControl<number | undefined | null>
    }>;
    companyNames: FormArray<any>
  }>;

  constructor(
      private modalService: NgbModal,
      private filterService: FilterService,
      private couponsService: CouponsService,
      private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initAppliedFilters();

    // this.onFormReset();

    this.couponSub = this.couponsService.coupons$.subscribe(coupons => {
      this.filterService.rebuildFilters(coupons);
    });

    this.filtersSub = this.filterService.filteredCoupons$.subscribe(coupons => {
      this.filtersKeyValue = this.filterService.filtersToDisplay;
      if (!this.form) {
        this.initForm(this.filtersKeyValue);
      }
      // this.filterService.rebuildFilters(coupons);
    });
  }

  openModal() {
    this.modalService.open(this.filterContent, {
      scrollable: true, modalDialogClass: 'top-5rem', beforeDismiss: () => {
        this.onSubmit();
        return true;
      }
    });
  }

  applyFilters() {
    // TODO replace with real object after building form
    const tempFilters: FilterKeys = this.appliedFilters;
    this.filterService.applyFilters(tempFilters);
  }

  onFilterClick(key: string, value: string | number | Date) {
    const keys = key.split('.');
    if (keys.length > 1) {
      (this.appliedFilters as any)[keys[0]][keys[1]] = value;
    } else {
      const _value: string[] = (this.appliedFilters as any)[keys[0]];
      const i                = _value.indexOf(value as string);
      i >= 0 ? _value.splice(i, 1) : _value.push(value as string);
    }
    console.log(this.appliedFilters);
  }

  onSubmit() {
    console.log('submit');
    console.log(this.form);
  }

  getControl(name: string) {
    return this.form.get(name.split('.'));
  }

  getControlArray(name: string) {
    return this.form.get(name) as FormArray;
  }

  private initAppliedFilters() {
    this.appliedFilters = {
      categories: [],
      companyNames: [],
      priceRange: {start: null, end: null},
      dateRange: {start: null, end: null},
      freeText: ''
    }
  }

  private initForm(initial: FilterKeys) {
    this.form = new FormGroup({
      categories: new FormArray([]),
      companyNames: new FormArray([]),
      priceRange: new FormGroup({
        start: new FormControl<number | undefined>(initial.priceRange.start, [Validators.min(initial.priceRange.start), Validators.max(initial.priceRange.end)]),
        end: new FormControl<number | undefined>(initial.priceRange.end, [Validators.min(initial.priceRange.start), Validators.max(initial.priceRange.end)])
      }),
      dateRange: new FormGroup({
        start: new FormControl<Date | undefined>(initial.dateRange.start),
        end: new FormControl<Date | undefined>(initial.dateRange.end)
      }),
      freeText: new FormControl<string | undefined>(initial.freeText)
    });

    initial.categories.forEach(c => (this.form.get('categories') as FormArray).push(new FormControl(null)));
    initial.companyNames.forEach(c => (this.form.get('companyNames') as FormArray).push(new FormControl(null)));
  }

  onCategoryReset() {
    (this.form.get('categories') as FormArray).reset();
  }

  onCompanyReset() {
    (this.form.get('companyNames') as FormArray).reset();
  }

  onPriceReset() {
    this.form.get('priceRange').setValue({
      start: this.filtersKeyValue.priceRange.start,
      end: this.filtersKeyValue.priceRange.end
    });
  }

  onDateReset() {
    this.form.get('dateRange').setValue({
      start: this.filtersKeyValue.dateRange.start,
      end: this.filtersKeyValue.dateRange.end
    });
  }

  ngOnDestroy(): void {
    this.couponSub.unsubscribe();
    this.filtersSub.unsubscribe();
  }

}
