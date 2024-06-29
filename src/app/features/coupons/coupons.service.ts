import {Injectable} from '@angular/core';
import {BehaviorSubject, map, Observable, tap} from 'rxjs';
import {Coupon, ICouponParams} from '../../shared/models/coupon.model';
import {LogoService} from '../../header/logo/logo.service';
import tempCoupons from './temp-coupons.json';
import {AuthService} from '../../auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class CouponsService {

  public static readonly defaultCouponImage = 'assets/images/empty_coupon_img.png';

  private tempArr: Coupon[] = tempCoupons.map(val => Coupon.create(val)).map(c => {
    if (c.params.image == null) c.params.image = CouponsService.defaultCouponImage;
    return c;
  });

  private filteredCouponsSubject = new BehaviorSubject<Coupon[]>(this.tempArr.slice());
  private originCouponsSubject   = new BehaviorSubject<Coupon[]>(this.tempArr.slice());
  private cartSubject            = new BehaviorSubject<string[]>([]);
  private wishSubject            = new BehaviorSubject<string[]>([]);

  constructor(
      private logo: LogoService,
      private auth: AuthService
  ) {}

  findCoupons(filter: (coupon: Coupon) => boolean): Coupon[] {
    return this.originCouponsSubject.value.filter(c => filter(c));
  }

  getCouponsById(...ids: string[]): Coupon[] {
    return ids ? this.originCouponsSubject.value.filter(c => ids.includes(c.params.id)) : [];
  }

  get purchasedCoupons$(): Observable<string[]> {
    return this.auth.user$.pipe(map(user => user.couponsPurchased || []));
  }

  get initialCoupons$() {
    return this.originCouponsSubject.asObservable();
  }

  get coupons$(): Observable<Coupon[]> {
    return this.filteredCouponsSubject.asObservable();
  }

  get cartIds$(): Observable<string[]> {
    return this.auth.user$.pipe(
        map(user => user != null ? user.couponsInCart || [] : null),
        map(coupons => coupons != null ? coupons : this.cartSubject.value),
        tap(coupons => this.cartSubject.next(coupons))
    );
  }

  get wishIds$(): Observable<string[]> {
    return this.auth.user$.pipe(
        map(user => user != null ? user.couponsInWish || [] : null),
        map(coupons => coupons != null ? coupons : this.wishSubject.value),
        tap(coupons => this.wishSubject.next(coupons))
    );
  }

  set coupons(coupons: Coupon[]) {
    this.filteredCouponsSubject.next(coupons);
  }

  addToCart(...coupons: Coupon[] | string[]) {
    const ids = new Set<string>(this.cartSubject.value);
    coupons.forEach((c: Coupon | string) => ids.add(c instanceof Coupon ? c.params.id : c));
    this.auth.updateUser({user: {couponsInCart: [...ids]}});
    this.logo.blink();
    this.cartSubject.next([...ids]);
  }

  addToWish(...coupons: Coupon[] | string[]) {
    const ids = new Set<string>(this.wishSubject.value);
    coupons.forEach((c: Coupon | string) => ids.add(c instanceof Coupon ? c.params.id : c));
    this.auth.updateUser({user: {couponsInWish: [...ids]}});
    this.logo.blink();
    this.wishSubject.next([...ids]);
  }

  removeFromCart(...coupons: Coupon[] | string[]) {
    coupons.forEach((c: Coupon | string) => this.removeCouponFromList(c, this.cartSubject.value));
    this.auth.updateUser({user: {couponsInCart: this.cartSubject.value.map((c: Coupon | string) => c instanceof Coupon ? c.params.id : c)}});
    this.cartSubject.next(this.cartSubject.value);
  }

  removeFromWish(...coupons: (Coupon | string)[]) {
    coupons.forEach((c: Coupon | string) => this.removeCouponFromList(c, this.wishSubject.value));
    this.auth.updateUser({user: {couponsInWish: this.wishSubject.value.map((c: Coupon | string) => c instanceof Coupon ? c.params.id : c)}});
    this.wishSubject.next(this.wishSubject.value);
  }

  moveToWish(...coupons: Coupon[] | string[]) {
    this.removeFromCart(...coupons);
    this.addToWish(...coupons);
  }

  moveToCart(...coupons: Coupon[] | string[]) {
    this.removeFromWish(...coupons);
    this.addToCart(...coupons);
  }

  addCoupon(couponParams: ICouponParams) {
    const list = this.originCouponsSubject.value.slice();
    list.push(Coupon.create(couponParams));
    this.originCouponsSubject.next(list);
    // this.updateJsonFile();
  }

  removeCoupon(id: string) {
    const list = this.originCouponsSubject.value;
    const idx  = list.findIndex(c => c.params.id === id);
    if (idx > -1) {
      list.splice(idx, 1);
    }
    this.originCouponsSubject.next(list);
    // this.updateJsonFile();
  }

  private updateJsonFile() {
    const JSONToFile = (coupons: Coupon[], filename: string) => {
      const blob = new Blob([JSON.stringify(coupons, null, 2)], {
        type: 'application/json'
      });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `${filename}.json`;
      a.click();
      URL.revokeObjectURL(url);
    };
    JSONToFile(this.originCouponsSubject.value, 'temp-coupons');
  }

  /**
   * remove coupon and return its id or null if absent
   * @param couponOrId
   * @param list
   * @private
   */
  private removeCouponFromList(couponOrId: Coupon | string, list: string[]) {
    const i = list.findIndex(id => couponOrId instanceof Coupon ? id === couponOrId.params.id : id === couponOrId);
    if (i >= 0) {
      list.splice(i, 1);
    }
  }

}
