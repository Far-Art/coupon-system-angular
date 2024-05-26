import {Injectable} from '@angular/core';
import {Coupon} from "../../../shared/models/coupon.model";
import {BehaviorSubject} from "rxjs";
import {LogoService} from "../../logo.service";

@Injectable({
  providedIn: 'root'
})
export class WishListService {

  private list: Coupon[] = [];

  private listSubject = new BehaviorSubject<Coupon[]>(this.list);

  get coupons$() {
    return this.listSubject.asObservable();
  }

  get couponsInWish(): number {
    return this.list.length;
  }

  isPresent(coupon: Coupon): boolean {
    return this.list.find(c => c.params.id === coupon.params.id) !== undefined;
  }

  addToWish(coupon: Coupon) {
    this.list.push(coupon);
    this.logoService.blink();
    this.listSubject.next(this.list.slice());
  }

  removeFromWish(coupon: Coupon) {
    const i = this.list.findIndex(c => c.params.id === coupon.params.id);
    this.list.splice(i, 1);
    this.listSubject.next(this.list.slice());
  }

  constructor(private logoService: LogoService
  ) { }
}
