import {Injectable} from '@angular/core';
import {BehaviorSubject, concatMap, filter, from, map, mergeMap, Observable, of, take, tap, toArray} from 'rxjs';
import {Coupon} from '../../../../../shared/models/coupon.model';
import {CouponsService} from '../../../../../features/coupons/coupons.service';


export interface Controls {
  isApplied: boolean,
  isChecked: boolean,
  isDisabled: boolean
}

export interface Key extends Controls {
  value: string,
}

export interface DateKey extends Controls {
  start: Date,
  end: Date,
}

export interface PriceKey extends Controls {
  start: number,
  end: number,
}

export interface Filters {
  categories: Key[],
  companyNames: Key[],
  priceRange: PriceKey,
  dateRange: DateKey,
  hidePurchased: Controls,
  freeText: Key,
  badge: string
}

@Injectable()
export class FilterService {

  private _filters: Filters | null = null;

  private filtersSubject = new BehaviorSubject<Filters>(this.createOrUpdateFilters(null));

  get filters$() {
    return this.filtersSubject.asObservable();
  }

  constructor(private couponsService: CouponsService) {
    this.initInitialFilters();
  }

  updateDisplayedCoupons(filters: Filters | null): void {
    // if no filters applied, supply all coupons
    if (filters == null) {
      this.initInitialFilters();
    } else {
      this.notifyFilters(filters);
      this.couponsService.initialCoupons$.pipe(take(1),
          mergeMap(coupons => this.filter(coupons)),
          tap(coupons => this.updateFilters(coupons))
      ).subscribe(coupons => this.couponsService.coupons = coupons);
    }
  }

  private filter(coupons: Coupon[]): Observable<Coupon[]> {
    // if free text applied, skip other filters
    if (this._filters.freeText.isApplied) {
      return of(coupons.filter(c => this.hasFreeText(c, this._filters.freeText.value as string)));
    }

    return of(coupons.filter(coupon => {
      const hasCategory    = this.hasCategory(coupon, this._filters.categories);
      const hasCompanyName = this.hasCompanyName(coupon, this._filters.companyNames);
      const hasPrice       = this.hasPriceOrDateRange(coupon, this._filters.priceRange);
      const hasDate        = this.hasPriceOrDateRange(coupon, this._filters.dateRange);

      return hasCategory &&
          hasCompanyName &&
          hasPrice &&
          hasDate;
    }))
        .pipe(
            mergeMap(coupons => from(coupons).pipe(
                mergeMap(coupons => this.isPurchased(coupons).pipe(map(isPurchased => ({
                  isPurchased: isPurchased,
                  coupon: coupons
                })))),
                filter(res => this._filters.hidePurchased?.isChecked ? !res.isPurchased : true),
                map(res => res.coupon),
                toArray()
            ))
        );
  }

  private hasCategory(coupon: Coupon, categories: Key[]): boolean {
    return (categories.length === 0 || categories.every(c => !c.isChecked) || categories.every(c => c.isChecked)) // true if none or all is checked
        || categories.some(k => k.isChecked && k.value.toLowerCase().localeCompare(coupon.params.category.toLowerCase()) === 0);
  }

  private hasCompanyName(coupon: Coupon, companies: Key[]): boolean {
    return (companies.length === 0 || companies.every(c => !c.isChecked) || companies.every(c => c.isChecked)) // true if none or all is checked
        || companies.some(k => k.isChecked && k.value.toLowerCase().localeCompare(coupon.params.companyName.toLowerCase()) === 0);
  }

  private hasPriceOrDateRange(coupon: Coupon, range: PriceKey | DateKey): boolean {
    return range == null || !range.isApplied || (coupon.params.price >= range.start && coupon.params.price <= range.end);
  }

  private hasFreeText(coupon: Coupon, text: string): boolean {
    const prm = coupon.params;
    return text && (prm.title.toLowerCase().includes(text.toLowerCase())
        || prm.description.toLowerCase().includes(text.toLowerCase())
        || prm.companyName.toLowerCase().includes(text.toLowerCase()));
  }

  private isPurchased(coupon: Coupon): Observable<boolean> {
    return this.couponsService.purchasedCoupons$.pipe(
        take(1),
        map(ids => ids.includes(coupon.params.id))
    );
  }

  private recalculateMinMaxValues(coupons: Coupon[]): { price: PriceKey, date: DateKey } {
    const value: { price: PriceKey, date: DateKey } = {
      date: {
        start: new Date(Date.now()), end: new Date(Date.now()),
        isDisabled: false,
        isChecked: false,
        isApplied: false
      },
      price: {
        start: 0, end: 0,
        isDisabled: false,
        isChecked: false,
        isApplied: false
      }
    }

    if (coupons?.length > 0) {
      let minPrice = coupons[0].params.price;
      let maxPrice = coupons[0].params.price;
      let starDate = coupons[0].params.startDate;
      let endDate  = coupons[0].params.endDate;

      for (let i = 1; i < coupons.length; i++) {
        const c = coupons[i];
        if (c.params.price < minPrice) minPrice = c.params.price;
        if (c.params.price > maxPrice) maxPrice = c.params.price;
        if (c.params.startDate < starDate) starDate = c.params.startDate;
        if (c.params.endDate > endDate) endDate = c.params.endDate;
      }

      value.price.start = minPrice;
      value.price.end   = maxPrice;
      value.date.start  = starDate;
      value.date.end    = endDate;

    }
    return value;
  }

  private notifyFilters(filters: Filters) {
    this._filters = filters;
    this.filtersSubject.next(filters);
  }

  private updateFiltersBadge(filters: Filters): string {
    let num = 0;
    if (filters) {
      if (filters.freeText?.isApplied) return 'free text';
      if (filters.dateRange?.isApplied) num++;
      if (filters.priceRange?.isApplied) num++;
      if (filters.categories?.length > 0) num += filters.categories.filter(v => v.isChecked).length;
      if (filters.companyNames?.length > 0) num += filters.companyNames.filter(v => v.isChecked).length;
    }
    return `${num > 0 ? num : ''}`;
  }

  private updateCategories(coupons: Coupon[]): Key[] {
    const map: Map<string, Key> = new Map();
    coupons.forEach(c => map.set(c.params.category, {
      value: c.params.category,
      isDisabled: false,
      isChecked: false,
      isApplied: false
    }));
    return [...map.values()];
  }

  private updateCompanyNames(coupons: Coupon[]): Key[] {
    const map: Map<string, Key> = new Map();
    coupons.forEach(c => map.set(c.params.companyName, {
      value: c.params.companyName,
      isDisabled: false,
      isChecked: false,
      isApplied: false
    }));
    return [...map.values()];
  }

  private initInitialFilters(): void {
    let initial: Filters;

    this.couponsService.initialCoupons$.pipe(
        take(1),
        tap(coupons => initial = this.createOrUpdateFilters(coupons, initial)),
        tap(coupons => initial.categories = this.updateCategories(coupons)),
        tap(coupons => initial.companyNames = this.updateCompanyNames(coupons)),
        tap(() => initial.badge = this.updateFiltersBadge(initial)),
        tap(() => this.notifyFilters(initial)),
        concatMap(() => this.couponsService.purchasedCoupons$.pipe(take(1), tap(purchased => {
          if (purchased.length === 0) {
            initial.hidePurchased.isDisabled = true;
            initial.hidePurchased.isChecked  = false;
            initial.hidePurchased.isApplied  = false;
          }
        })))
    ).subscribe(() => this.updateDisplayedCoupons(this._filters));
  }

  private updateFilters(coupons: Coupon[]) {
    this.notifyFilters(this.createOrUpdateFilters(coupons, this._filters));
  }

  private createOrUpdateFilters(coupons: Coupon[], filters?: Filters) {
    let _filters: Filters;
    if (filters) {
      _filters = filters;
    } else {
      _filters = {
        hidePurchased: {isChecked: true, isApplied: true, isDisabled: false},
        categories: null,
        companyNames: null,
        priceRange: {start: 0, end: 0, isDisabled: false, isChecked: false, isApplied: false},
        dateRange: {start: null, end: null, isDisabled: false, isChecked: false, isApplied: false},
        freeText: {isChecked: false, isApplied: false, value: null, isDisabled: false},
        badge: null
      }
    }

    const minMax              = this.recalculateMinMaxValues(coupons);
    _filters.dateRange.start  = minMax.date.start;
    _filters.dateRange.end    = minMax.date.end;
    _filters.priceRange.start = minMax.price.start;
    _filters.priceRange.end   = minMax.price.end;
    return _filters;
  }
}
