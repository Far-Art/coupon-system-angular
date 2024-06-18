import {Injectable} from '@angular/core';
import {AuthService} from '../../../auth/auth.service';
import {DataManagerService} from '../../../shared/services/data-manager.service';
import {catchError, concatMap, map, Observable, take, tap, throwError} from 'rxjs';
import {UserData} from '../../../shared/models/user-data.model';
import {Coupon} from '../../../shared/models/coupon.model';
import {CouponsService} from '../../../features/coupons/coupons.service';
import {HttpErrorResponse} from '@angular/common/http';


@Injectable()
export class CartService {

  constructor(
      private authService: AuthService,
      private dataManager: DataManagerService,
      private couponsService: CouponsService
  ) { }

  private userDataBackup: UserData;

  buyCoupons$(purchased: Coupon[]): Observable<UserData> {
    return this.authService.user$.pipe(
        take(1),
        tap(user => this.backupUserData(user)),
        concatMap(user => this.updateUserCoupons(user, purchased)),
        concatMap(user => this.dataManager.putUserData(this.authService.authData.localId, user)),
        tap(user => this.couponsService.removeFromCart(...user.couponsBought)),
        tap(() => this.couponsService.notify()),
        tap(user => this.authService.updateUser(user)),
        catchError(this.handleError)
    ) as Observable<UserData>;
  }

  updateUserCart(coupons: Coupon[]): void {
    this.authService.updateUser({couponsInCart: coupons.map(c => c.params.id)} as UserData, false);
  }

  isUserPresent$(): Observable<boolean> {
    return this.authService.user$.pipe(map(user => !!user));
  }

  private updateUserCoupons(user: UserData, purchased: Coupon[]): Observable<UserData> {
    return this.couponsService.cartIds$.pipe(
        take(1),
        tap(() => user.couponsBought = user.couponsBought != null ? user.couponsBought : []),
        map(() => purchased.map(v => v.params.id)),
        tap(purchased => user.couponsBought.push(...purchased)),
        tap(purchased => user.couponsInCart = user.couponsInCart.filter(cartId => !purchased.includes(cartId))),
        map(() => user)
    );
  }

  private backupUserData(user: UserData): void {
    this.userDataBackup = JSON.parse(JSON.stringify(user));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    this.authService.updateUser(this.userDataBackup);
    if (!error?.error || !error?.error?.error) {
      return throwError(() => new Error('Unknown error occurred'));
    }
    return throwError(() => new Error(error.error.error.message.replaceAll('_', ' ')));
  }
}
