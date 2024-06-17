import {Injectable} from '@angular/core';
import {AuthService} from '../../../auth/auth.service';
import {DataManagerService} from '../../../shared/services/data-manager.service';
import {concatMap, map, Observable, take, tap} from 'rxjs';
import {UserData} from '../../../shared/models/user-data.model';
import {Coupon} from '../../../shared/models/coupon.model';
import {CouponsService} from '../../../features/coupons/coupons.service';


@Injectable()
export class CartService {

  constructor(
      private authService: AuthService,
      private dataManager: DataManagerService,
      private couponsService: CouponsService
  ) { }

  buyCoupons$(coupons: Coupon[]): Observable<number[]> {
    return this.authService.user$.pipe(
        take(1),
        map(user => this.setUser(user)),
        tap(user => this.addCouponsToBought(user, coupons)),
        concatMap(user => this.dataManager.putUserData(this.authService.authData.localId, user)),
        map(user => user.couponsBought)
    );
  }

  isUserPresent$(): Observable<boolean> {
    return this.authService.user$.pipe(map(user => !!user));
  }

  private addCouponsToBought(user: UserData, purchased: Coupon[]) {
    if (user.couponsBought == null) {
      user.couponsBought = [];
    }

    // TODO do not add duplicates
    user.couponsBought.push(...purchased.map(c => c.params.id));

    user.couponsInCart = user.couponsInCart.filter(id => purchased.some(c => c.params.id === id));
    console.log(user.couponsInCart);

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
