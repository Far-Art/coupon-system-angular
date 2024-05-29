import {Injectable} from '@angular/core';
import {Coupon} from '../../../shared/models/coupon.model';
import {BehaviorSubject, map, Observable, take} from 'rxjs';
import {CouponsService} from '../../../features/coupons/coupons.service';


export interface FilterKeys {
  categories: string[],
  companyNames: string[],
  priceRange: { start: number, end: number },
  dateRange: { start: Date, end: Date },
  freeText: string
}

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  private activeFilters: FilterKeys | null = null;

  private filteredCouponsSubject = new BehaviorSubject<Coupon[]>([]);

  get filteredCoupons$() {
    return this.filteredCouponsSubject.asObservable();
  }

  get getFiltersBadgeValue(): string {
    let num = 0;
    if (this.activeFilters) {
      if (this.activeFilters.freeText) return 'free text';
      if (this.activeFilters.dateRange) num++;
      if (this.activeFilters.priceRange) num++;
      if (this.activeFilters.companyNames.length > 0) num++;
      if (this.activeFilters.categories.length > 0) num++;
    }
    return '' + (num > 0 ? num : '');
  }

  constructor(private couponsService: CouponsService) { }

  getFiltersToDisplay(): Observable<FilterKeys> {
    return this.couponsService.originCoupons$.pipe(take(1), map(coupons => {
      let keys: FilterKeys;

      if (coupons.length > 0) {
        const categories = new Set<string>();
        const names      = new Set<string>();
        let minPrice     = coupons[0].params.price;
        let maxPrice     = coupons[0].params.price;
        let starDate     = coupons[0].params.startDate;
        let endDate      = coupons[0].params.endDate;

        for (let i = 1; i < coupons.length; i++) {
          const c = coupons[i];
          categories.add(c.params.category)
          names.add(c.params.companyName);
          if (c.params.price < minPrice) minPrice = c.params.price;
          if (c.params.price > maxPrice) maxPrice = c.params.price;
          if (c.params.startDate < starDate) starDate = c.params.startDate;
          if (c.params.endDate > endDate) endDate = c.params.endDate;
        }
        keys = {
          categories: [...categories],
          companyNames: [...names],
          priceRange: {start: minPrice, end: maxPrice},
          dateRange: {start: starDate, end: endDate},
          freeText: null
        }
      }
      return keys;
    }));
  }

  applyFilters(filters: FilterKeys) {
    this.activeFilters = filters;

    if (filters == null) {
      this.couponsService.originCoupons$.pipe(take(1)).subscribe(coupons => {
        this.filteredCouponsSubject.next(coupons);
        this.couponsService.coupons = coupons;
      });
      return;
    }

    const set = new Set<Coupon>();

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
                set.add(c);
              }
            });
            const filtered = [...set];
            this.filteredCouponsSubject.next([...set]);
            this.couponsService.coupons = filtered;
          });

    } else {
      this.couponsService.originCoupons$.pipe(take(1)).subscribe(coupons => {
        if (filters.categories) {
          coupons.forEach((coupon: Coupon) => {
            if (filters.categories.includes(coupon.params.category)) {
              set.add(coupon);
            }
          });
        }

        if (filters.companyNames) {
          (set.size === 0 ? coupons : set).forEach((coupon: Coupon) => {
            if (filters.companyNames.includes(coupon.params.companyName)) {
              set.add(coupon);
            }
          });
        }

        if (filters.priceRange) {
          (set.size === 0 ? coupons : set).forEach((coupon: Coupon) => {
            if (filters.priceRange.start <= coupon.params.price && filters.priceRange.end >= coupon.params.price) {
              set.add(coupon);
            }
          });
        }

        if (filters.dateRange) {
          (set.size === 0 ? coupons : set).forEach((coupon: Coupon) => {
            if (filters.dateRange.start <= coupon.params.startDate && filters.dateRange.end >= coupon.params.endDate) {
              set.add(coupon);
            }
          });
        }

        const filtered = [...set];
        this.filteredCouponsSubject.next(filtered);
        this.couponsService.coupons = filtered;
      });
    }
  }
}
