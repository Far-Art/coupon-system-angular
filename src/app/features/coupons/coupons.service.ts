import {Injectable} from '@angular/core';
import {BehaviorSubject, map, Observable, tap} from 'rxjs';
import {Coupon} from '../../shared/models/coupon.model';
import {LogoService} from '../../header/logo/logo.service';
import tempCoupons from './temp-coupons.json';
import {AuthService} from '../../auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class CouponsService {

  private readonly defaultCouponImage = 'assets/images/empty_coupon_img.png';

  private tempArr: Coupon[] = tempCoupons.map(val => Coupon.create(val)).map(c => {
    if (c.params.image == null) c.params.image = this.defaultCouponImage;
    return c;
  });

  private filteredCouponsSubject = new BehaviorSubject<Coupon[]>(this.tempArr.slice());
  private originCouponsSubject   = new BehaviorSubject<Coupon[]>(this.tempArr.slice());
  private cartSubject            = new BehaviorSubject<number[]>([]);
  private wishSubject            = new BehaviorSubject<number[]>([]);

  constructor(
      private logo: LogoService,
      private auth: AuthService
  ) {}

  getCouponsById(...ids: number[]): Coupon[] {
    return ids ? this.originCouponsSubject.value.filter(c => ids.includes(c.params.id)) : [];
  }

  get purchasedCoupons$(): Observable<number[]> {
    return this.auth.user$.pipe(map(user => user.couponsPurchased || []));
  }

  get initialCoupons$() {
    return this.originCouponsSubject.asObservable();
  }

  get coupons$(): Observable<Coupon[]> {
    return this.filteredCouponsSubject.asObservable();
  }

  get cartIds$(): Observable<number[]> {
    return this.auth.user$.pipe(
        map(user => user != null ? user.couponsInCart || [] : null),
        map(coupons => coupons != null ? coupons : this.cartSubject.value),
        tap(coupons => this.cartSubject.next(coupons))
    );
  }

  get wishIds$(): Observable<number[]> {
    return this.auth.user$.pipe(
        map(user => user != null ? user.couponsInWish || [] : null),
        map(coupons => coupons != null ? coupons : this.wishSubject.value),
        tap(coupons => this.wishSubject.next(coupons))
    );
  }

  set coupons(coupons: Coupon[]) {
    this.filteredCouponsSubject.next(coupons);
  }

  addToCart(...coupons: Coupon[] | number[]) {
    const ids = new Set<number>(this.cartSubject.value);
    coupons.forEach((c: Coupon | number) => ids.add(c instanceof Coupon ? c.params.id : c));
    this.auth.updateUser({user: {couponsInCart: [...ids]}});
    this.logo.blink();
    this.cartSubject.next([...ids]);
  }

  addToWish(...coupons: Coupon[] | number[]) {
    const ids = new Set<number>(this.wishSubject.value);
    coupons.forEach((c: Coupon | number) => ids.add(c instanceof Coupon ? c.params.id : c));
    this.auth.updateUser({user: {couponsInWish: [...ids]}});
    this.logo.blink();
    this.wishSubject.next([...ids]);
  }

  removeFromCart(...coupons: Coupon[] | number[]) {
    coupons.forEach((c: Coupon | number) => this.removeCoupon(c, this.cartSubject.value));
    this.auth.updateUser({user: {couponsInCart: this.cartSubject.value.map((c: Coupon | number) => c instanceof Coupon ? c.params.id : c)}});
    this.cartSubject.next(this.cartSubject.value);
  }

  removeFromWish(...coupons: Coupon[] | number[]) {
    coupons.forEach((c: Coupon | number) => this.removeCoupon(c, this.wishSubject.value));
    this.auth.updateUser({user: {couponsInWish: this.wishSubject.value.map((c: Coupon | number) => c instanceof Coupon ? c.params.id : c)}});
    this.wishSubject.next(this.wishSubject.value);
  }

  moveToWish(...coupons: Coupon[] | number[]) {
    this.removeFromCart(...coupons);
    this.addToWish(...coupons);
  }

  moveToCart(...coupons: Coupon[] | number[]) {
    this.removeFromWish(...coupons);
    this.addToCart(...coupons);
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
