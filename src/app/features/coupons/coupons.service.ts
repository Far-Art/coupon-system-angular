import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Coupon} from '../../shared/models/coupon.model';
import {LogoService} from '../../header/logo/logo.service';
import tempCoupons from './temp-coupons.json';


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

  private displayedCouponsSubject = new BehaviorSubject<Coupon[]>(this.tempArr.slice());
  private originCouponsSubject    = new BehaviorSubject<Coupon[]>(this.tempArr.slice());
  private cartSubject             = new BehaviorSubject<number[]>([]);
  private wishSubject             = new BehaviorSubject<number[]>([]);

  getCouponsById(...ids: number[]): Coupon[] {
    return this.originCouponsSubject.value.filter(c => ids.includes(c.params.id));
  }

  get originCoupons$() {
    return this.originCouponsSubject.asObservable();
  }

  get displayedCoupons$(): Observable<Coupon[]> {
    return this.displayedCouponsSubject.asObservable();
  }

  get cartIds$(): Observable<number[]> {
    return this.cartSubject.asObservable();
  }

  get wishIds$(): Observable<number[]> {
    return this.wishSubject.asObservable();
  }

  set displayedCoupons(coupons: Coupon[]) {
    this.displayedCouponsSubject.next(coupons);
  }

  addToCart(...coupons: Coupon[]) {
    const ids = new Set<number>(this.cartSubject.value);
    coupons.forEach(c => ids.add(c.params.id));

    this.logo.blink();
    this.cartSubject.next([...ids]);
  }

  addToWish(...coupons: Coupon[]) {
    const ids = new Set<number>(this.wishSubject.value);
    coupons.forEach(c => ids.add(c.params.id));

    this.logo.blink();
    this.wishSubject.next([...ids]);
  }

  removeFromCart(...coupons: Coupon[]) {
    coupons.forEach(c => {
      this.removeCoupon(c, this.cartSubject.value);
    });
    this.cartSubject.next(this.cartSubject.value);
  }

  removeFromWish(...coupons: Coupon[]) {
    coupons.forEach(c => {
      this.removeCoupon(c, this.wishSubject.value);
    });
    this.wishSubject.next(this.wishSubject.value);
  }

  isPresentInCart(coupon: Coupon): boolean {
    return this.cartSubject.value.find(id => id === coupon.params.id) !== undefined;
  }

  isPresentInWish(coupon: Coupon): boolean {
    return this.wishSubject.value.find(id => id === coupon.params.id) !== undefined;
  }

  get couponsInCart(): number {
    return this.cartSubject.value.length;
  }

  get couponsInWish(): number {
    return this.wishSubject.value.length;
  }

  moveToWish(...coupons: Coupon[]) {
    this.removeFromCart(...coupons);
    this.addToWish(...coupons);
    this.cartSubject.next(this.cartSubject.value);
    this.displayedCouponsSubject.next(this.displayedCouponsSubject.value);
  }

  moveToCart(...coupons: Coupon[]) {
    this.removeFromWish(...coupons);
    this.addToCart(...coupons);
    this.wishSubject.next(this.wishSubject.value);
    this.displayedCouponsSubject.next(this.displayedCouponsSubject.value);
  }

  /**
   * remove coupon and return its id or null if absent
   * @param coupon
   * @param list
   * @private
   */
  private removeCoupon(coupon: Coupon, list: number[]) {
    const i = list.findIndex(id => id === coupon.params.id);
    if (i >= 0) {
      list.splice(i, 1);
    }
  }

  constructor(private logo: LogoService) {}
}
