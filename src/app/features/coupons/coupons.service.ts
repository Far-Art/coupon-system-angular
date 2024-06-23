import {Injectable} from '@angular/core';
import {BehaviorSubject, map, Observable} from 'rxjs';
import {Coupon} from '../../shared/models/coupon.model';
import {LogoService} from '../../header/logo/logo.service';
import tempCoupons from './temp-coupons.json';
import {AuthService} from '../../auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class CouponsService {

  private tempArr: Coupon[] = tempCoupons.map(val => Coupon.create(val)).map(c => {
    if (c.params.image == null) {
      c.params.image = 'assets/images/empty_coupon_img.png';
    }
    return c;
  });

  private filteredCouponsSubject = new BehaviorSubject<Coupon[]>(this.tempArr.slice());
  private originCouponsSubject    = new BehaviorSubject<Coupon[]>(this.tempArr.slice());
  private cartSubject             = new BehaviorSubject<number[]>([]);
  private wishSubject             = new BehaviorSubject<number[]>([]);

  constructor(private logo: LogoService, private auth: AuthService) {}

  getCouponsById(...ids: number[]): Coupon[] {
    return ids ? this.originCouponsSubject.value.filter(c => ids.includes(c.params.id)) : [];
  }

  get purchasedCoupons$(): Observable<number[]> {
    return this.auth.user$.pipe(map(user => user?.couponsBought != null ? user.couponsBought : []));
  }

  get initialCoupons$() {
    return this.originCouponsSubject.asObservable();
  }

  get coupons$(): Observable<Coupon[]> {
    return this.filteredCouponsSubject.asObservable();
  }

  get cartIds$(): Observable<number[]> {
    return this.cartSubject.asObservable();
  }

  get wishIds$(): Observable<number[]> {
    return this.wishSubject.asObservable();
  }

  set coupons(coupons: Coupon[]) {
    this.filteredCouponsSubject.next(coupons);
  }

  addToCart(...coupons: Coupon[] | number[]) {
    const ids = new Set<number>(this.cartSubject.value);
    coupons.forEach((c: Coupon | number) => ids.add(c instanceof Coupon ? c.params.id : c));

    this.logo.blink();
    this.cartSubject.next([...ids]);
  }

  addToWish(...coupons: Coupon[] | number[]) {
    const ids = new Set<number>(this.wishSubject.value);
    coupons.forEach((c: Coupon | number) => ids.add(c instanceof Coupon ? c.params.id : c));

    this.logo.blink();
    this.wishSubject.next([...ids]);
  }

  removeFromCart(...coupons: Coupon[] | number[]) {
    coupons.forEach((c: Coupon | number) => {
      this.removeCoupon(c, this.cartSubject.value);
    });
    this.cartSubject.next(this.cartSubject.value);
  }

  removeFromWish(...coupons: Coupon[] | number[]) {
    coupons.forEach((c: Coupon | number) => {
      this.removeCoupon(c, this.wishSubject.value);
    });
    this.wishSubject.next(this.wishSubject.value);
  }

  get couponsInCart(): number {
    return this.cartSubject.value.length;
  }

  get couponsInWish(): number {
    return this.wishSubject.value.length;
  }

  moveToWish(...coupons: Coupon[] | number[]) {
    this.removeFromCart(...coupons);
    this.addToWish(...coupons);
    this.cartSubject.next(this.cartSubject.value);
    this.notify();
  }

  moveToCart(...coupons: Coupon[] | number[]) {
    this.removeFromWish(...coupons);
    this.addToCart(...coupons);
    this.wishSubject.next(this.wishSubject.value);
    this.notify();
  }

  notify() {
    this.filteredCouponsSubject.next(this.filteredCouponsSubject.value);
  }

  /**
   * remove coupon and return its id or null if absent
   * @param couponOrId
   * @param list
   * @private
   */
  private removeCoupon(couponOrId: Coupon | number, list: number[]) {
    const i = list.findIndex(id => couponOrId instanceof Coupon ? id === couponOrId.params.id : id === couponOrId);
    if (i >= 0) {
      list.splice(i, 1);
    }
  }

}
