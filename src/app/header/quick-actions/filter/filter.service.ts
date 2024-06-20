import {Injectable} from '@angular/core';
import {Coupon} from '../../../shared/models/coupon.model';
import {BehaviorSubject, concatMap, filter, from, map, mergeMap, Observable, of, take, tap, toArray} from 'rxjs';
import {CouponsService} from '../../../features/coupons/coupons.service';


interface Controls {
  isApplied?: boolean,
  isChecked?: boolean,
  isDisabled?: boolean
}

interface Key extends Controls {
  value: string,
}

interface DateKey extends Controls {
  start: Date,
  end: Date,
}

interface PriceKey extends Controls {
  start: number,
  end: number,
}

export interface FilterKeys {
  categories: Key[],
  companyNames: Key[],
  priceRange: PriceKey,
  dateRange: DateKey,
  hidePurchased: Controls,
  freeText: Key
}

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  private _activeFilters: FilterKeys | null = null;

  private filteredCouponsSubject = new BehaviorSubject<Coupon[]>([]);

  get filteredCoupons$() {
    return this.filteredCouponsSubject.asObservable();
  }

  get getFiltersBadgeValue(): string {
    let num = 0;
    if (this._activeFilters) {
      if (this._activeFilters.freeText?.isApplied) return 'free text';
      if (this._activeFilters.dateRange?.isApplied) num++;
      if (this._activeFilters.priceRange?.isApplied) num++;
      if (this._activeFilters.categories.length > 0) num += this._activeFilters.categories.filter(v => v.isChecked).length;
      if (this._activeFilters.companyNames.length > 0) num += this._activeFilters.companyNames.filter(v => v.isChecked).length;
    }
    return `${num > 0 ? num : ''}`;
  }

  constructor(private couponsService: CouponsService) { }

  get getFiltersToDisplay$(): Observable<FilterKeys> {
    return this.couponsService.displayedCoupons$.pipe(
        take(1),
        concatMap(coupons => {
          return this.updateFilterKeys(coupons);
        }));
  }

  updateDisplayedCoupons(filters: FilterKeys | null): void {
    this._activeFilters = filters;

    // if no filters applied, supply all coupons
    if (filters == null) {
      this.couponsService.originCoupons$.pipe(take(1)).subscribe(coupons => this.notify(coupons));
    } else {
      this.couponsService.originCoupons$.pipe(take(1),
          mergeMap(coupons => this.filter(coupons, filters)))
          .subscribe(coupons => this.notify(coupons));
    }
  }

  private notify(coupons: Coupon[]) {
    this.filteredCouponsSubject.next(coupons);
    this.couponsService.displayedCoupons = coupons;
  }

  private filter(coupons: Coupon[], filters: FilterKeys): Observable<Coupon[]> {
    // if free text applied, skip other filters
    if (filters.freeText.isApplied) {
      return of(coupons.filter(c => this.hasFreeText(c, filters.freeText.value)));
    }

    return of(coupons.filter(coupon => {
      const hasCategory    = this.hasCategory(coupon, filters.categories);
      const hasCompanyName = this.hasCompanyName(coupon, filters.companyNames);
      const hasPrice       = this.hasPriceOrDateRange(coupon, filters.priceRange);
      const hasDate        = this.hasPriceOrDateRange(coupon, filters.dateRange);

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
            filter(res => filters.hidePurchased.isChecked ? !res.isPurchased : true),
            map(res => res.coupon),
            toArray()
        ))
    );
  }

  private hasCategory(coupon: Coupon, categories: Key[]): boolean {
    return (categories.length === 0 || categories.every(c => !c.isChecked) || categories.every(c => c.isChecked)) // true if none or all is checked
        || categories.some(c => c.isChecked && c.value.toLowerCase().localeCompare(coupon.params.category.toLowerCase()) === 0);
  }

  private hasCompanyName(coupon: Coupon, companies: Key[]): boolean {
    return (companies.length === 0 || companies.every(c => !c.isChecked) || companies.every(c => c.isChecked)) // true if none or all is checked
        || companies.some(c => c.isChecked && c.value.toLowerCase().localeCompare(coupon.params.companyName.toLowerCase()) === 0);
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

  private updateFilterKeys(displayedCoupons: Coupon[]): Observable<FilterKeys | null> {
    return this.couponsService.originCoupons$
        .pipe(
            take(1),
            map(originCoupons => {
              let keys: FilterKeys | null = null;

              if (displayedCoupons.length > 0) {
                let minPrice = displayedCoupons[0].params.price;
                let maxPrice = displayedCoupons[0].params.price;
                let starDate = displayedCoupons[0].params.startDate;
                let endDate  = displayedCoupons[0].params.endDate;

                for (let i = 1; i < displayedCoupons.length; i++) {
                  const c = displayedCoupons[i];
                  if (c.params.price < minPrice) minPrice = c.params.price;
                  if (c.params.price > maxPrice) maxPrice = c.params.price;
                  if (c.params.startDate < starDate) starDate = c.params.startDate;
                  if (c.params.endDate > endDate) endDate = c.params.endDate;
                }

                const categories: Map<string, Key> = new Map();
                const names: Map<string, Key>      = new Map();

                for (let i = 0; i < originCoupons.length; i++) {
                  const c = originCoupons[i];

                  categories.set(c.params.category, {
                    value: c.params.category,
                    isDisabled: !displayedCoupons.map(v => v.params.category).includes(c.params.category)
                  })

                  names.set(c.params.companyName, {
                    value: c.params.companyName,
                    isDisabled: !displayedCoupons.map(v => v.params.companyName).includes(c.params.companyName)
                  });
                }

                keys = {
                  categories: [...categories.values()],
                  companyNames: [...names.values()],
                  priceRange: {start: minPrice, end: maxPrice},
                  dateRange: {start: starDate, end: endDate},
                  hidePurchased: {isChecked: false},
                  freeText: null
                }
              }

              this._activeFilters = keys;
              return keys;
            }));

  }
}
