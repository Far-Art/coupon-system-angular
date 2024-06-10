import {AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {FilterKeys, FilterService} from './filter.service';
import {Subscription, take} from 'rxjs';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';


interface MainFormType {
  categories: FormArray<FormGroup<{
    key: FormControl<string>,
    isChecked: FormControl<boolean>,
    isDisabled: FormControl<boolean>
  }>>,
  companyNames: FormArray<FormGroup<{
    key: FormControl<string>,
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
  freeText: FormGroup<{
    key: FormControl<string>
  }>;
}

@Component({
  selector: 'sc-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss']
})
export class FilterModalComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('filterModal') private filterContent: TemplateRef<any>;

  form: FormGroup<MainFormType>;

  filtersKeyValue: FilterKeys | null;

  private filtersSub: Subscription;

  private modal: NgbModalRef = null;

  private prevForm: FormGroup<MainFormType>;

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

  ngAfterViewInit(): void {
    this.form.controls.freeText.valueChanges.subscribe(val => {
      if (val) {
        const elements = document.getElementsByClassName('accordion-item');
        for (let i = 0; i < elements.length; i++) {
          const button = elements[i].children[0].children[0];
          const div    = elements[i].children[1];

          button.classList.add('collapsed');
          div.classList.remove('show');
        }
      }
    });
  }

  onSubmit() {
    console.log('start',this.form.value.dateRange.start)
    console.log('end',this.form.value.dateRange.end)
    const filterKeys: FilterKeys = this.form.value as FilterKeys;
    this.prevForm.patchValue(this.form.value);

    filterKeys.freeText.isApplied = filterKeys.freeText.key?.length >= 3;

    if (!filterKeys.freeText.isApplied) {
      // remove value if user did not change value or is bad value
      filterKeys.priceRange.isApplied = !(!this.form.controls.priceRange.dirty || this.form.controls.priceRange.invalid);
      // remove value if user did not change value or is bad value
      filterKeys.dateRange.isApplied = !(!this.form.controls.dateRange.dirty || this.form.controls.dateRange.invalid);
    }

    this.filterService.updateDisplayedCoupons(this.form.pristine ? null : filterKeys);
  }

  onFormReset() {
    this.form = this.initForm(this.filtersKeyValue);
    this.filterService.updateDisplayedCoupons(null);
  }

  onCategoryReset() {
    this.form.controls.categories.controls.forEach(c => c.patchValue({isChecked: false, isDisabled: false}));
  }

  onCompanyReset() {
    this.form.controls.companyNames.controls.forEach(c => c.patchValue({isChecked: false, isDisabled: false}));
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

  onCancel() {
    this.form.patchValue(this.prevForm.value);
    this.modal.close('Close click');
  }

  openModal() {
    this.modal = this.modalService.open(this.filterContent, {
      scrollable: true, modalDialogClass: ''
    });
  }

  recalculateFilters() {
    this.filterService.getFiltersToDisplay$.pipe(take(1)).subscribe(filters => {
      if (filters) {
        Object.assign(this.filtersKeyValue, filters);
        this.form.controls.priceRange.patchValue(filters.priceRange);
        this.form.controls.dateRange.patchValue(filters.dateRange);
      }
    });
  }

  private initForm(initial: FilterKeys): FormGroup<MainFormType> {
    const form = new FormGroup({
      categories: new FormArray([]),
      companyNames: new FormArray([]),
      priceRange: this.initPriceRange(initial),
      dateRange: this.initDateRange(initial),
      freeText: new FormGroup({
        key: new FormControl<string>(null, Validators.minLength(3))
      })
    });

    initial?.categories.forEach(key => {
      (form.controls.categories as FormArray).push(new FormGroup({
        key: new FormControl(key.key),
        isChecked: new FormControl(false),
        isDisabled: new FormControl(false)
      }));
    });

    initial?.companyNames.forEach(key => {
      (form.controls.companyNames as FormArray).push(new FormGroup({
        key: new FormControl(key.key),
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
