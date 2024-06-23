import {Injectable} from '@angular/core';
import {BehaviorSubject, filter, from, map, mergeMap, Observable, of, take, tap, toArray} from 'rxjs';
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

  private filtersSubject = new BehaviorSubject<Filters>(null);

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
          mergeMap(coupons => this.filter(coupons)))
          .subscribe(coupons => this.couponsService.coupons = coupons);
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
                filter(res => this._filters.hidePurchased.isChecked ? !res.isPurchased : true),
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

  private updateFilterKeys(displayedCoupons: Coupon[]): Observable<Filters | null> {
    // TODO rework this method
    return this.couponsService.initialCoupons$
        .pipe(
            take(1),
            map(originCoupons => {
              let keys: Filters | null = null;

              if (displayedCoupons.length > 0) {
                const categories: Map<string, Key> = new Map();
                const names: Map<string, Key>      = new Map();

                for (let i = 0; i < originCoupons.length; i++) {
                  const c = originCoupons[i];

                  categories.set(c.params.category, {
                    value: c.params.category,
                    isDisabled: !displayedCoupons.map(v => v.params.category).includes(c.params.category),
                    isApplied: false,
                    isChecked: false
                  })

                  names.set(c.params.companyName, {
                    value: c.params.companyName,
                    isDisabled: !displayedCoupons.map(v => v.params.companyName).includes(c.params.companyName),
                    isApplied: false,
                    isChecked: false
                  });
                }

                const minMaxValues = this.recalculateMinMaxValues(displayedCoupons);
                keys               = {
                  categories: [...categories.values()],
                  companyNames: [...names.values()],
                  priceRange: {
                    start: minMaxValues.price.start, end: minMaxValues.price.end,
                    isChecked: false,
                    isApplied: false,
                    isDisabled: false
                  },
                  dateRange: {
                    start: minMaxValues.date.start, end: minMaxValues.date.end,
                    isChecked: false,
                    isApplied: false,
                    isDisabled: false
                  },
                  hidePurchased: {isChecked: false, isDisabled: false, isApplied: false},
                  freeText: null,
                  badge: null
                }
              }

              this._filters = keys;
              return keys;
            }));

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

    if (coupons.length > 0) {
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
    const initial: Filters = {
      hidePurchased: {isChecked: true, isApplied: true, isDisabled: false},
      categories: null,
      companyNames: null,
      priceRange: {start: 0, end: 0, isDisabled: false, isChecked: false, isApplied: false},
      dateRange: {start: null, end: null, isDisabled: false, isChecked: false, isApplied: false},
      freeText: {isChecked: false, isApplied: false, value: null, isDisabled: false},
      badge: null
    }

    this.couponsService.initialCoupons$.pipe(
        take(1),
        tap(coupons => initial.categories = this.updateCategories(coupons)),
        tap(coupons => initial.companyNames = this.updateCompanyNames(coupons)),
        tap(coupons => {
          const res                = this.recalculateMinMaxValues(coupons);
          initial.dateRange.start  = res.date.start;
          initial.dateRange.end    = res.date.end;
          initial.priceRange.start = res.price.start;
          initial.priceRange.end   = res.price.end;
        }),
        tap(() => initial.badge = this.updateFiltersBadge(initial)),
        tap(() => this.notifyFilters(initial))
    ).subscribe(() => this.updateDisplayedCoupons(this._filters));
  }
}
