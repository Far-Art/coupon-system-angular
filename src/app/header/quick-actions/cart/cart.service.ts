import {Injectable} from '@angular/core';
import {AuthService} from '../../../auth/auth.service';
import {DataManagerService} from '../../../shared/services/data-manager.service';
import {concatMap, map, Observable, take, tap} from 'rxjs';
import {UserData} from '../../../shared/models/user-data.model';
import {Coupon} from '../../../shared/models/coupon.model';


@Injectable()
export class CartService {

  constructor(private authService: AuthService, private dataManager: DataManagerService) { }

  buyCoupons$(coupons: Coupon[]): Observable<number[]> {
    return this.authService.user$.pipe(
        take(1),
        tap(user => this.addCouponsToBought(user, coupons)),
        map(user => this.setUser(user)),
        concatMap(user => this.dataManager.putUserData(this.authService.authData.localId, user)),
        map(user => user.couponsBought));
  }

  isUserPresent$(): Observable<boolean> {
    return this.authService.user$.pipe(map(user => !!user));
  }

  private addCouponsToBought(user: UserData, coupons: Coupon[]) {
    if (user.couponsBought == null) {
      user.couponsBought = [];
    }

    // TODO do not add duplicates
    // TODO do not clear all cart if not all coupons was bought
    user.couponsBought.push(...coupons.map(c => c.params.id));

    if (user.couponsInCart) {
      user.couponsInCart.length = 0;
    }
  }

  private setUser(user: UserData) {
    if (user == null) {
      user = {
        name: 'Guest',
        couponsInCart: [],
        couponsInWish: [],
        couponsBought: []
      } as UserData;
    }
    return user;
  }
}
