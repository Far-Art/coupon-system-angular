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

  buyCoupons$(purchased: Coupon[]): Observable<UserData> {
    return this.authService.user$.pipe(
        take(1),
        map(user => this.setUser(user)),
        concatMap(user => this.updateUserCoupons(user, purchased)),
        concatMap(user => this.dataManager.putUserData(this.authService.authData.localId, user)),
        tap(user => this.couponsService.removeFromCart(...user.couponsBought))
    );
  }

  isUserPresent$(): Observable<boolean> {
    return this.authService.user$.pipe(map(user => !!user));
  }

  private updateUserCoupons(user: UserData, purchased: Coupon[]): Observable<UserData> {
    // TODO rework this
    return this.couponsService.cartIds$.pipe(
        take(1),
        tap(() => user.couponsBought = user.couponsBought != null ? user.couponsBought : []),
        tap(ids => user.couponsInCart = ids.filter(id => !purchased.map(c => c.params.id).includes(id))),
        tap(ids => user.couponsBought.push(...ids)),
        map(() => user)
    );
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
