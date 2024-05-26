import {Injectable} from '@angular/core';
import {Coupon} from "../../../shared/models/coupon.model";
import {BehaviorSubject, take} from "rxjs";
import {CouponsService} from "../../../features/coupons/coupons.service";

export interface FilterKeys {
  categories?: string[],
  companyNames?: string[],
  priceRange?: { start?: number, end?: number },
  dateRange?: { start?: Date, end?: Date },
  freeText?: string
}

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  private activeFilters: FilterKeys | null = null;

  private categoryMap = new Map<string, Coupon[]>();

  private companyNameMap: Map<string, Coupon[]> = new Map();

  private filteredCouponsSubject = new BehaviorSubject<Coupon[]>([]);

  private coupons: Coupon[] = [];

  get filteredCoupons$() {
    return this.filteredCouponsSubject.asObservable();
  }

  get filtersApplied(): number {
    let num = 0;
    if (this.activeFilters) {
      if (this.activeFilters.dateRange) num++;
      if (this.activeFilters.priceRange) num++;
      if (this.activeFilters.companyNames) num++;
      if (this.activeFilters.categories) num++;
      if (this.activeFilters.freeText) num++;
    }
    return num;
  }

  constructor(private couponsService: CouponsService) { }

  rebuildFilters(coupons: Coupon[]) {
    this.coupons = coupons;
    this.buildFilterLists();
  }

  get filtersToDisplay(): FilterKeys {
    let keys: FilterKeys = {};

    if (this.coupons) {
      const categories = new Set<string>();
      const names      = new Set<string>();
      let minPrice     = this.coupons[0].params.price;
      let maxPrice     = this.coupons[0].params.price;
      let starDate  = this.coupons[0].params.startDate;
      let endDate   = this.coupons[0].params.endDate;

      for (let i = 1; i < this.coupons.length; i++) {
        const c = this.coupons[i];
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
        dateRange: {start: starDate, end: endDate}
      }
    }
    return keys;
  }

  applyFilters(filters: FilterKeys) {
    this.activeFilters = filters;
    // TODO apply correct logic for filtering

    const filteredMap = new Map<number, Coupon>();

    // TODO make all logic inside subscribe
    let coupons: Coupon[] = [];
    this.couponsService.coupons$.pipe(take(1)).subscribe(list => coupons = list);

    // if (filters.categories) {
    //   filters.categories.forEach(cat => {
    //     const coupons = this.categoryMap.get(cat);
    //     coupons?.forEach(coupon => filteredMap.set(coupon.params.id, coupon));
    //   });
    // }
    // if (filters.companyNames) {
    //   filters.companyNames.forEach(com => {
    //     const coupons = this.companyNameMap.get(com);
    //     coupons?.forEach(coupon => filteredMap.set(coupon.params.id, coupon));
    //   });
    // }
    // const filteredArray: Coupon[];
    // if (filters.categories || filters.companyNames) {
    //   // filter from filtered map
    //   if(filteredMap.size === 0){
    //     // TODO return empty array or error
    //   }
    //
    // } else {
    //  // filter from all coupons
    // }

    coupons.forEach(c => {
      if (filters.categories) {
        filters.categories.forEach(category => {
          if (c.params.category.toLowerCase() === category.toLowerCase()) {
            filteredMap.set(c.params.id, c);
          }
        })
      }

      if (filters.companyNames) {
        filters.companyNames.forEach(companyName => {
          if (companyName.toLowerCase() === c.params.companyName.toLowerCase()) {
            filteredMap.set(c.params.id, c);
          }
        })
      }

      if (filters.priceRange?.start || filters.priceRange?.end) {
        const start = filters.priceRange.start || 0;
        const end   = filters.priceRange.end || Number.MAX_SAFE_INTEGER;
        coupons.forEach(c => {
          if (c.params.price >= start && c.params.price <= end) {
            filteredMap.set(c.params.id, c);
          }
        });
      }

      if (filters.dateRange?.start || filters.dateRange?.end) {
        const start = filters.dateRange.start || new Date();
        const end   = filters.dateRange.end || new Date().setFullYear(new Date().getFullYear() + 1);
        coupons.forEach(c => {
          if (c.params.startDate >= start && c.params.endDate <= end) {
            filteredMap.set(c.params.id, c);
          }
        });
      }

      if (filters.freeText) {
        const txt = filters.freeText.toLowerCase();
        coupons.forEach(c => {
          const prms = c.params;
          if (prms.title.toLowerCase().includes(txt)
              || prms.description.toLowerCase().includes(txt)) {
            filteredMap.set(c.params.id, c);
          }
        });
      }
    });

    return [...filteredMap.values()];
  }

  private buildFilterLists() {
    // this.coupons.forEach((coupon: Coupon) => {
    //   this.addToMap(this.categoryMap, coupon.params.category, coupon);
    //   this.addToMap(this.companyNameMap, coupon.params.companyName, coupon);
    // });
  }

  private addToMap(map: Map<string, Coupon[]>, key: string, coupon: Coupon) {
    if (map.has(key)) {
      map.get(key)?.push(coupon);
    } else {
      map.set(key, [coupon]);
    }
  }
}
