import {Injectable} from '@angular/core';
import {AuthService} from '../../../../../auth/auth.service';
import {catchError, concatMap, map, Observable, of, take, tap, throwError} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';
import {DataManagerService} from '../../../../../shared/services/data-manager.service';
import {CouponsService} from '../../../../../features/coupons/coupons.service';
import {UserData} from '../../../../../shared/models/user-data.model';
import {Coupon} from '../../../../../shared/models/coupon.model';
import {ToastService} from '../../../../../core/toasts/toast.service';


@Injectable()
export class CartService {

  constructor(
      private authService: AuthService,
      private dataManager: DataManagerService,
      private couponsService: CouponsService,
      private toast: ToastService
  ) { }

  private userDataBackup: Partial<UserData>;

  buyCoupons$(purchased: Coupon[], options?: { moveToWIsh?: boolean }): Observable<Partial<UserData>> {
    return this.authService.user$.pipe(
        take(1),
        tap(user => this.backupUserData(user)),
        concatMap(user => this.updateUserCoupons(user, purchased)),
        concatMap(user => user.type !== 'guest' ? this.dataManager.putUserData(user.authData.localId, user) : of(user)),
        tap(() => this.couponsService.removeFromCart(...purchased)),
        tap(() => options?.moveToWIsh ? this.couponsService.addToWish(...purchased) : null),
        tap(() => this.toast.notify({
          message: `purchased ${purchased.length} coupon${purchased.length > 1 ? 's' : ''}`,
          style: 'success'
        })),
        tap(user => this.authService.updateUser({
          user: user,
          immediate: true
        })),
        catchError(this.handleError)
    );
  }

  isUserPresent$(): Observable<boolean> {
    return this.authService.user$.pipe(map(user => user.type !== 'guest'));
  }

  private updateUserCoupons(user: Partial<UserData>, purchased: Coupon[]): Observable<Partial<UserData>> {
    return this.couponsService.cartIds$.pipe(
        take(1),
        tap(() => user.couponsPurchased = user.couponsPurchased || []),
        map(() => purchased.map(v => v.params.id)),
        tap(purchased => user.couponsPurchased.push(...purchased)),
        tap(purchased => user.couponsInCart = user.couponsInCart.filter(cartId => !purchased.includes(cartId))),
        map(() => user)
    );
  }

  private backupUserData(user: Partial<UserData>): void {
    this.userDataBackup = JSON.parse(JSON.stringify(user));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    this.authService.updateUser({user: this.userDataBackup});
    if (!error?.error || !error?.error?.error) {
      return throwError(() => new Error('Unknown error occurred'));
    }
    return throwError(() => new Error(error.error.error.message.replaceAll('_', ' ')));
  }
}
