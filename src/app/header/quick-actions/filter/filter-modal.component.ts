import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FilterKeys, FilterService} from './filter.service';
import {CouponsService} from '../../../features/coupons/coupons.service';
import {Subscription} from 'rxjs';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';


interface MainFormType {
  dateRange: FormGroup<{
    start: FormControl<Date>,
    end: FormControl<Date>
  }>,
  freeText: FormControl<string>;
  categories: FormArray;
  priceRange: FormGroup<{
    start: FormControl<number>,
    end: FormControl<number>
  }>,
  companyNames: FormArray
}

@Component({
  selector: 'sc-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss']
})
export class FilterModalComponent implements OnInit, OnDestroy {

  @ViewChild('filterContent', {static: true}) private filterContent: TemplateRef<any>;

  private couponSub: Subscription;
  private filtersSub: Subscription;

  private prevForm: FormGroup<MainFormType>;
  form: FormGroup<MainFormType>;

  filtersKeyValue: FilterKeys;

  constructor(
      private modalService: NgbModal,
      private filterService: FilterService,
      private couponsService: CouponsService
  ) {}

  ngOnInit(): void {
    this.couponSub = this.couponsService.originCoupons$.subscribe(coupons => {
      this.filterService.getFiltersToDisplay().subscribe(filters => {
        this.filtersKeyValue = filters;
        if (!this.form) {
          this.initForm(this.filtersKeyValue);
        }
      });
    });
  }

  // TODO recalculate filters key values
  openModal() {
    this.modalService.open(this.filterContent, {
      scrollable: true, modalDialogClass: 'top-5rem'
    });
  }

  onSubmit() {
    const applied: FilterKeys = this.form.value as FilterKeys;
    this.prevForm             = Object.create(this.form);

    if (!applied.freeText) {
      // convert boolean values back to string and remove nulls
      applied.categories = applied.categories.map((el, index) => {
        return el ? this.filtersKeyValue.categories[index] : el;
      }).filter(el => !!el);

      // convert boolean values back to string and remove nulls
      applied.companyNames = applied.companyNames.map((el, index) => {
        return el ? this.filtersKeyValue.companyNames[index] : el;
      }).filter(el => !!el);

      // remove value if user did not change value or is bad value
      if (!this.form.get('priceRange').dirty || this.form.get('priceRange').invalid) {
        applied.priceRange = null;
      }

      // remove value if user did not change value or is bad value
      if (!this.form.get('dateRange').dirty || this.form.get('dateRange').invalid) {
        applied.dateRange = null;
      }
    }

    this.filterService.applyFilters(this.form.pristine ? null : applied);
  }

  getControl(name: string) {
    return this.form.get(name.split('.'));
  }

  getControlArray(name: string) {
    return this.form.get(name) as FormArray;
  }

  onCategoryReset() {
    (this.form.get('categories') as FormArray).reset();
  }

  onCompanyReset() {
    (this.form.get('companyNames') as FormArray).reset();
  }

  onPriceReset() {
    this.form.get('priceRange').reset();
    this.form.get('priceRange').setValue({
      start: this.filtersKeyValue.priceRange.start,
      end: this.filtersKeyValue.priceRange.end
    });
  }

  // TODO reset date values
  onDateReset() {
    this.form.get('dateRange').reset();
    this.form.get('dateRange').setValue({
      start: this.filtersKeyValue.dateRange.start,
      end: this.filtersKeyValue.dateRange.end
    });
  }

  onFormReset() {
    this.initForm(this.filtersKeyValue);
    this.filterService.applyFilters(null);
  }

  // TODO reset form values to previous ones
  onCancel() {
    // this.form.patchValue(this.prevForm.value);
    this.modalService.dismissAll('Close click');
  }

  private initForm(initial: FilterKeys) {
    this.form = new FormGroup({
      categories: new FormArray([...initial.categories.map(() => new FormControl(null))]),
      companyNames: new FormArray([...initial.companyNames.map(() => new FormControl(null))]),
      priceRange: new FormGroup({
        start: new FormControl<number>(initial.priceRange.start, [Validators.min(initial.priceRange.start), Validators.max(initial.priceRange.end)]),
        end: new FormControl<number>(initial.priceRange.end, [Validators.min(initial.priceRange.start), Validators.max(initial.priceRange.end)])
      }),
      dateRange: new FormGroup({
        start: new FormControl<Date>(initial.dateRange.start),
        end: new FormControl<Date>(initial.dateRange.end)
      }),
      freeText: new FormControl<string>(null)
    });
  }

  ngOnDestroy(): void {
    this.couponSub.unsubscribe();
    this.filtersSub.unsubscribe();
  }

}
