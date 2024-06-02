import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {FilterKeys, FilterService} from './filter.service';
import {Subscription, take} from 'rxjs';
import {FormArray, FormControl, FormGroup} from '@angular/forms';


interface MainFormType {
  categories: FormArray<FormGroup<{
    name: FormControl<string>,
    isChecked: FormControl<boolean>,
    isDisabled: FormControl<boolean>
  }>>,
  companyNames: FormArray<FormGroup<{
    name: FormControl<string>,
    isChecked: FormControl<boolean>,
    isDisabled: FormControl<boolean>
  }>>,
  dateRange: FormGroup<{
    start: FormControl<Date>,
    end: FormControl<Date>,
  }>,
  priceRange: FormGroup<{
    start: FormControl<number>,
    end: FormControl<number>,
  }>,
  freeText: FormControl<string>;
}

@Component({
  selector: 'sc-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss']
})
export class FilterModalComponent implements OnInit, OnDestroy {

  @ViewChild('filterContent', {static: true}) private filterContent: TemplateRef<unknown>;

  private filtersSub: Subscription;

  private modal: NgbModalRef = null;

  private prevForm: FormGroup<MainFormType>;
  form: FormGroup<MainFormType>;

  filtersKeyValue: FilterKeys | null;

  constructor(
      private modalService: NgbModal,
      private filterService: FilterService
  ) {}

  ngOnInit(): void {
    this.filtersSub = this.filterService.getFiltersToDisplay$.subscribe(filters => {
      this.filtersKeyValue = filters;
      if (!this.form) {
        this.form     = this.initForm(this.filtersKeyValue);
        this.prevForm = this.initForm(this.filtersKeyValue);
      }
      this.form.patchValue(filters);
    });
  }

  onSubmit() {
    const applied: FilterKeys = this.form.value as FilterKeys;

    this.prevForm = Object.create(this.form);

    if (!applied.freeText) {
      // remove value if user did not change value or is bad value
      if (!this.form.controls.priceRange.dirty || this.form.controls.priceRange.invalid) {
        applied.priceRange = null;
      }

      // remove value if user did not change value or is bad value
      if (!this.form.controls.dateRange.dirty || this.form.controls.dateRange.invalid) {
        applied.dateRange = null;
      }

    }

    this.filterService.updateDisplayedCoupons(this.form.pristine ? null : applied);
  }

  onFormReset() {
    this.form = this.initForm(this.filtersKeyValue);
    // TODO sending null breaks form controls
    this.filterService.updateDisplayedCoupons(null);
  }

  onCategoryReset() {
    this.form.controls.categories.reset();
  }

  onCompanyReset() {
    this.form.controls.companyNames.reset();
  }

  onPriceReset() {
    this.form.controls.priceRange.reset();
    this.form.controls.priceRange.setValue({
      start: this.filtersKeyValue.priceRange.start,
      end: this.filtersKeyValue.priceRange.end
    });
  }

  // TODO reset date values
  onDateReset() {
    this.form.controls.dateRange.reset();
    this.form.controls.dateRange.setValue({
      start: this.filtersKeyValue.dateRange.start,
      end: this.filtersKeyValue.dateRange.end
    });
  }

  // TODO reset form values to previous ones
  onCancel() {
    // this.form.patchValue(this.prevForm.value);
    this.modal.close('Close click');
  }

  openModal() {
    this.modal = this.modalService.open(this.filterContent, {
      scrollable: true, modalDialogClass: 'top-5rem'
    });
  }

  recalculateFilters() {
    this.filterService.getFiltersToDisplay$.pipe(take(1)).subscribe(filters => {
      if (filters) {
        // TODO update form controls
        this.filtersKeyValue = filters;
      }
    });
  }

  private initForm(initial: FilterKeys): FormGroup<MainFormType> {
    const form = new FormGroup({
      categories: new FormArray([]),
      companyNames: new FormArray([]),
      priceRange: this.initPriceRange(initial),
      dateRange: this.initDateRange(initial),
      freeText: new FormControl<string>(null)
    });

    initial?.categories.forEach(key => {
      (form.controls.categories as FormArray).push(new FormGroup({
        name: new FormControl(key.name),
        isChecked: new FormControl(false),
        isDisabled: new FormControl(false)
      }));
    });

    initial?.companyNames.forEach(key => {
      (form.controls.companyNames as FormArray).push(new FormGroup({
        name: new FormControl(key.name),
        isChecked: new FormControl(false),
        isDisabled: new FormControl(false)
      }));
    });

    return form;
  }

  private initPriceRange(initial: FilterKeys) {
    return new FormGroup({
      start: new FormControl<number>(initial?.priceRange.start),
      end: new FormControl<number>(initial?.priceRange.end)
    });
  }

  private initDateRange(initial: FilterKeys) {
    return new FormGroup({
      start: new FormControl<Date>(initial?.dateRange.start),
      end: new FormControl<Date>(initial?.dateRange.end)
    });
  }

  ngOnDestroy(): void {
    this.filtersSub.unsubscribe();
  }

}
