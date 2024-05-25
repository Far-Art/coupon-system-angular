import {Injectable} from '@angular/core';
import {Coupon} from "../../../shared/models/coupon.model";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private list: Coupon[] = [];

  private couponsSubject = new BehaviorSubject<Coupon[]>([]);

  get coupons$() {
    return this.couponsSubject.asObservable();
  }

  isPresent(coupon: Coupon): boolean {
    return this.list.find(c => c.params.id === coupon.params.id) !== undefined;
  }

  addToCart(coupon: Coupon) {
    this.list.push(coupon);
    this.couponsSubject.next(this.list.slice());
  }

  removeFromCart(coupon: Coupon) {
    const i = this.list.findIndex(c => c.params.id === coupon.params.id);
    this.list.splice(i, 1);
    this.couponsSubject.next(this.list.slice());
  }

  get couponsInCart(): number {
    return this.list.length;
  }

  constructor() { }
}
