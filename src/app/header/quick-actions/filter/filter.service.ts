import {Injectable} from '@angular/core';
import {Coupon} from '../../../shared/models/coupon.model';
import {BehaviorSubject, concatMap, map, Observable, take, tap} from 'rxjs';
import {CouponsService} from '../../../features/coupons/coupons.service';


interface Key {
  name: string,
  isChecked: boolean,
  isDisabled?: boolean
}

interface DateKey {
  start: Date,
  end: Date
}

interface PriceKey {
  start: number,
  end: number
}

export interface FilterKeys {
  categories: Key[],
  companyNames: Key[],
  priceRange: PriceKey,
  dateRange: DateKey,
  freeText: string
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
      if (this._activeFilters.freeText) return 'free text';
      if (this._activeFilters.dateRange) num++;
      if (this._activeFilters.priceRange) num++;
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

    // if no filters, supply all coupons
    if (filters == null) {
      this.couponsService.originCoupons$.pipe(take(1)).pipe(tap(coupons => {
        this.notify(coupons);
      })).subscribe(() => null);
      return;
    }

    this.couponsService.originCoupons$.pipe(take(1),
        tap(coupons => {
          this.notify(this.filter(coupons, filters));
        })).subscribe(() => null);
  }

  private notify(coupons: Coupon[]) {
    this.filteredCouponsSubject.next(coupons);
    this.couponsService.displayedCoupons = coupons;
  }

  private filter(coupons: Coupon[], filters: FilterKeys) {
    // if free text supplied, don't apply other filters
    return coupons.filter(c => {
      return this.hasFreeText(c, filters) ||
          this.hasCategory(c, filters.categories) &&
          this.hasCompanyName(c, filters.companyNames) &&
          this.hasPriceOrDateRange(c, filters.priceRange) &&
          this.hasPriceOrDateRange(c, filters.dateRange);
    });
  }

  private hasCategory(coupon: Coupon, categories: Key[]): boolean {
    return (categories.length === 0 || categories.every(c => !c.isChecked) || categories.every(c => c.isChecked)) || categories.some(c => c.isChecked && c.name.toLowerCase().localeCompare(coupon.params.category.toLowerCase()) === 0);
  }

  private hasCompanyName(coupon: Coupon, companies: Key[]): boolean {
    return (companies.length === 0 || companies.every(c => !c.isChecked) || companies.every(c => c.isChecked)) || companies.some(c => c.isChecked && c.name.toLowerCase().localeCompare(coupon.params.companyName.toLowerCase()) === 0);
  }

  private hasPriceOrDateRange(coupon: Coupon, range: PriceKey | DateKey): boolean {
    return range == null || coupon.params.price >= range.start && coupon.params.price <= range.end;
  }

  private hasFreeText(coupon: Coupon, filter: FilterKeys): boolean {
    const prm = coupon.params;
    return filter.freeText && (prm.title.toLowerCase().includes(filter.freeText.toLowerCase())
        || prm.description.toLowerCase().includes(filter.freeText.toLowerCase())
        || prm.companyName.toLowerCase().includes(filter.freeText.toLowerCase()));
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

                const categories: Map<string, { name: string, isChecked: boolean, isDisabled: boolean }> = new Map();
                const names: Map<string, { name: string, isChecked: boolean, isDisabled: boolean }>      = new Map();

                for (let i = 0; i < originCoupons.length; i++) {
                  const c = originCoupons[i];

                  categories.set(c.params.category, {
                    name: c.params.category,
                    isChecked: false,
                    isDisabled: !displayedCoupons.map(v => v.params.category).includes(c.params.category)
                  })

                  names.set(c.params.companyName, {
                    name: c.params.companyName,
                    isChecked: false,
                    isDisabled: !displayedCoupons.map(v => v.params.companyName).includes(c.params.companyName)
                  });
                }

                keys = {
                  categories: [...categories.values()],
                  companyNames: [...names.values()],
                  priceRange: {start: minPrice, end: maxPrice},
                  dateRange: {start: starDate, end: endDate},
                  freeText: null
                }
              }

              this._activeFilters = keys;
              return keys;
            }));

  }
}
