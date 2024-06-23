import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {Filters, FilterService} from './filter.service';
import {Subscription} from 'rxjs';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../../../auth/auth.service';


type MainFormType<T> = {
  [PropertyKey in keyof T]: keyof T[PropertyKey] extends T[PropertyKey] ? T[PropertyKey] : any;
}

@Component({
  selector: 'sc-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss']
})
export class FilterModalComponent implements OnInit, OnDestroy, AfterViewInit {

  form: FormGroup<MainFormType<Filters>>;
  private prevForm: FormGroup<MainFormType<Filters>>;

  filters: Filters | null;

  private filtersSub: Subscription;
  private authSub: Subscription;

  constructor(private filterService: FilterService, private authService: AuthService) {}

  ngOnInit(): void {
    this.filtersSub = this.filterService.filters$.subscribe(filters => {
      this.filters = filters;
      if (!this.form) {
        this.form     = this.initForm() as FormGroup<MainFormType<Filters>>;
        this.prevForm = this.initForm() as FormGroup<MainFormType<Filters>>;
      } else {
        this.form.patchValue(this.filters);
        this.prevForm.patchValue(this.filters);
      }
    });

    this.authSub = this.authService.user$.subscribe(() => {
      this.filterService.updateDisplayedCoupons(null);
    });
  }

  ngAfterViewInit(): void {
    // collapse all accordion items when start typing in free text field
    this.form.controls.freeText.valueChanges.subscribe((val: string) => {
      if (val) {
        const elements = document.getElementsByClassName('accordion-item');
        for (let i = 0; i < elements.length; i++) {
          const button = elements[i].children[0].children[0];
          const div    = elements[i].children[1];
          button?.classList.add('collapsed');
          div?.classList.remove('show');
        }
      }
    });
  }

  onSubmit() {
    const filterKeys: Filters = this.form.value as Filters;
    this.prevForm.patchValue(this.form.value);

    filterKeys.freeText.isApplied = filterKeys.freeText.value?.length >= 3;

    if (!filterKeys.freeText.isApplied) {
      // remove value if user did not change value or is bad value
      filterKeys.priceRange.isApplied = !(!this.form.controls.priceRange.dirty || this.form.controls.priceRange.invalid);
      // remove value if user did not change value or is bad value
      filterKeys.dateRange.isApplied  = !(!this.form.controls.dateRange.dirty || this.form.controls.dateRange.invalid);
    }

    this.filterService.updateDisplayedCoupons(this.form.pristine ? null : filterKeys);
  }

  onFormReset() {
    this.filterService.updateDisplayedCoupons(null);
  }

  onCategoryReset() {
    this.form.controls.categories.reset();
    this.form.controls.categories.setValue(this.initCategories().value)
  }

  onCompanyReset() {
    this.form.controls.companyNames.reset();
    this.form.controls.companyNames.setValue(this.initCompanyNames().value)
  }

  onPriceReset() {
    this.form.controls.priceRange.reset();
    this.form.controls.priceRange.setValue({
      start: this.filters.priceRange.start,
      end: this.filters.priceRange.end,
      isChecked: this.filters.priceRange.isChecked,
      isApplied: this.filters.priceRange.isApplied,
      isDisabled: this.filters.priceRange.isDisabled
    });
  }

  onDateReset() {
    this.form.controls.dateRange.reset();
    this.form.controls.dateRange.setValue({
      start: this.filters.dateRange.start,
      end: this.filters.dateRange.end,
      isApplied: this.filters.dateRange.isApplied,
      isChecked: this.filters.dateRange.isChecked,
      isDisabled: this.filters.dateRange.isDisabled
    });
  }

  onCancel() {
    this.form.patchValue(this.prevForm.value);
  }

  private initForm() {
    return new FormGroup({
      categories: this.initCategories(),
      companyNames: this.initCompanyNames(),
      priceRange: this.initPriceRange(),
      dateRange: this.initDateRange(),
      hidePurchased: this.initHidePurchased(),
      freeText: new FormGroup({
        value: new FormControl<string>(this.filters.freeText.value, Validators.minLength(3))
      }),
      badge: new FormControl(this.filters.badge)
    });
  }

  private initCategories() {
    return new FormArray([...this.filters.categories.map(k => (
        new FormGroup({
          value: new FormControl(k.value),
          isChecked: new FormControl(k.isChecked),
          isApplied: new FormControl(k.isApplied),
          isDisabled: new FormControl(k.isDisabled)
        })
    ))])
  }

  private initCompanyNames() {
    return new FormArray([...this.filters.companyNames.map(k => (
        new FormGroup({
          value: new FormControl(k.value),
          isChecked: new FormControl(k.isChecked),
          isApplied: new FormControl(k.isApplied),
          isDisabled: new FormControl(k.isDisabled)
        })
    ))]);
  }

  private initHidePurchased() {
    return new FormGroup({
      isApplied: new FormControl(this.filters.hidePurchased.isApplied),
      isChecked: new FormControl(this.filters.hidePurchased.isChecked),
      isDisabled: new FormControl(this.filters.hidePurchased.isDisabled)
    })
  }

  private initPriceRange() {
    return new FormGroup({
      start: new FormControl<number>(this.filters?.priceRange?.start),
      end: new FormControl<number>(this.filters?.priceRange?.end)
    });
  }

  private initDateRange() {
    return new FormGroup({
      start: new FormControl<Date>(this.filters?.dateRange?.start),
      end: new FormControl<Date>(this.filters?.dateRange?.end)
    });
  }

  ngOnDestroy(): void {
    this.filtersSub.unsubscribe();
    this.authSub.unsubscribe();
  }

}
