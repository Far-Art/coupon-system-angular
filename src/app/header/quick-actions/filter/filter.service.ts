import {Injectable} from '@angular/core';
import {Coupon} from '../../../shared/models/coupon.model';
import {BehaviorSubject, concatMap, map, Observable, take} from 'rxjs';
import {CouponsService} from '../../../features/coupons/coupons.service';


export interface FilterKeys {
  categories: {
    name: string,
    isChecked: boolean,
    isDisabled?: boolean
  }[],
  companyNames: {
    name: string,
    isChecked: boolean,
    isDisabled?: boolean
  }[],
  priceRange: {
    start: number,
    end: number
  },
  dateRange: {
    start: Date,
    end: Date
  },
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

  updateDisplayedCoupons(filters: FilterKeys) {
    this._activeFilters = filters;

    if (filters == null) {
      this.couponsService.originCoupons$.pipe(take(1)).subscribe(coupons => {
        this.filteredCouponsSubject.next(coupons);
        this.couponsService.displayedCoupons = coupons;
      });
      return null;
    }

    const map = new Map<number, Coupon>();

    // if free text supplied, don't apply other filters
    if (filters.freeText) {
      this.couponsService.originCoupons$.pipe(take(1))
          .subscribe(coupons => {
            const txt = filters.freeText.toLowerCase();
            coupons.forEach(c => {
              const prm = c.params;
              if (prm.title.toLowerCase().includes(txt)
                  || prm.description.toLowerCase().includes(txt)
                  || prm.companyName.toLowerCase().includes(txt)) {
                map.set(c.params.id, c);
              }
            });
          });
    } else {
      this.couponsService.originCoupons$.pipe(take(1)).subscribe(coupons => {
        if (filters.categories?.length > 0) {
          coupons.forEach((coupon: Coupon) => {
            if (filters.categories.map(obj => obj.name).includes(coupon.params.category)) {
              map.set(coupon.params.id, coupon);
            }
          });
        }

        if (filters.companyNames?.length > 0) {
          (map.size === 0 ? coupons : map).forEach((coupon: Coupon) => {
            if (filters.companyNames.map(obj => obj.name).includes(coupon.params.companyName)) {
              map.set(coupon.params.id, coupon);
            }
          });
        }

        if (filters.priceRange) {
          (map.size === 0 ? coupons : map).forEach((coupon: Coupon) => {
            if (filters.priceRange.start <= coupon.params.price && filters.priceRange.end >= coupon.params.price) {
              map.set(coupon.params.id, coupon);
            }
          });
        }

        if (filters.dateRange) {
          (map.size === 0 ? coupons : map).forEach((coupon: Coupon) => {
            if (filters.dateRange.start <= coupon.params.startDate && filters.dateRange.end >= coupon.params.endDate) {
              map.set(coupon.params.id, coupon);
            }
          });
        }
      });
    }

    const filtered = [...map.values()];
    this.filteredCouponsSubject.next([...map.values()]);
    this.couponsService.displayedCoupons = filtered;
    return this.updateFilterKeys(filtered);
  }

  private updateFilterKeys(displayedCoupons: Coupon[]): Observable<FilterKeys | null> {
    return this.couponsService.originCoupons$
        .pipe(
            take(1),
            map(originCoupons => {
              let keys: FilterKeys | null = null;
              console.log('HERE!!!!!!!!!');

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
              return keys;
            }));

  }
}
