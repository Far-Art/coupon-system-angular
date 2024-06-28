import {Injectable} from '@angular/core';
import {FormControl} from '@angular/forms';
import {BehaviorSubject, catchError, concatMap, delay, map, Observable, take, tap, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {FirebaseResponseModel} from './models/firebase-response.model';
import {UserData} from '../shared/models/user-data.model';
import {DataManagerService} from '../shared/services/data-manager.service';
import {Router} from '@angular/router';


export type UserType = 'company' | 'customer' | 'admin' | 'guest';

export type LoginData = { email: string, password: string }

export type LoginForm = { email: FormControl<string>, password: FormControl<string> }

export interface SignupData {
  email: string,
  password: string,
  name: string,
  lastName: string | null,
  type: UserType,
  image: string
}

export interface SignupForm {
  email: FormControl<string>,
  password: FormControl<string>,
  name: FormControl<string>,
  lastName: FormControl<string | null>,
  type: FormControl<UserType>,
  image: FormControl<string>,
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly localStorageKey = 'casUserDataLocal';
  private readonly FIREBASE_KEY    = 'AIzaSyAS-z6cFLmZCdekAOJ2hTsFqcJD1D5WYV8';

  readonly passwordMinLength = 6;
  readonly passwordMaxLength = 30;

  private readonly apiCallDelay: number = 1500;
  private setTimeout: any;

  private _loginFormData: LoginData;
  private _signupFormData: SignupData;

  private userDataSubject = new BehaviorSubject<Partial<UserData>>(this.guestUser());

  constructor(private http: HttpClient, private dataManager: DataManagerService, private router: Router) {}

  get user$(): Observable<Partial<UserData>> {
    return this.userDataSubject.asObservable();
  }

  get user(): Partial<UserData> {
    return this.userDataSubject.value;
  }

  set loginFormData(data: LoginData) {
    this._loginFormData = data;
  }

  get loginFormData() {
    return this._loginFormData;
  }

  set signupFormData(data: SignupData) {
    this._signupFormData = data;
  }

  get signupFormData() {
    return this._signupFormData;
  }

  /**
   * update user and return timeout after which the user will be updated
   * @param params
   */
  updateUser(params?: { user: Partial<UserData>, immediate?: boolean }): number {
    clearTimeout(this.setTimeout);
    const updated = Object.assign(this.userDataSubject.value || {}, params?.user);

    setTimeout(() => {
      this.userDataSubject.next(updated);
      this.storeUserDataLocally();
    });

    // prevent large subsequent clicks
    this.setTimeout = setTimeout(() => {
      // if user present, store its data in database
      if (updated.authData) {
        this.dataManager.putUserData(updated.authData.localId, updated).subscribe(() => {});
      }
    }, params?.immediate ? 0 : this.apiCallDelay);
    return params?.immediate ? 0 : this.apiCallDelay;
  }

  autoLogin() {
    const user = localStorage.getItem(this.localStorageKey);
    if (user) this.userDataSubject.next(JSON.parse(user) as Partial<UserData>);
  }

  login(login: LoginData): Observable<UserData> {
    return this.http.post<FirebaseResponseModel>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.FIREBASE_KEY}`,
        {
          email: login.email,
          password: login.password,
          returnSecureToken: true
        }).pipe(
        delay(1500),
        map(response => ({authData: response} as Partial<UserData>)),
        concatMap(user => this.dataManager.fetchUserData(user.authData.localId)
            .pipe(
                take(1),
                tap(userData => {
                  this.userDataSubject.next({
                    ...user,
                    ...userData
                  });
                  this.storeUserDataLocally();
                }))),
        catchError(this.handleError)
    );
  }

  signUp(signup: SignupData): Observable<UserData> {
    return this.http.post<FirebaseResponseModel>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.FIREBASE_KEY}`,
        {
          email: signup.email,
          password: signup.password,
          returnSecureToken: true
        }).pipe(
        concatMap(res => this.dataManager.putUserData(res.localId, this.createUserData({signup: signup}))
            .pipe(
                take(1),
                tap(user => {
                  this.storeUserDataLocally();
                  this.userDataSubject.next(user);
                }))),
        catchError(this.handleError)
    );
  }

  logout() {
    this.removeLocalUserData();
    this.userDataSubject.next({
      ...this.guestUser(),
      couponsInWish: this.userDataSubject.value.couponsInWish || [],
      couponsInCart: this.userDataSubject.value.couponsInCart || []
    });
    this.router.navigate(['/']);
  }

  private storeUserDataLocally() {
    const user = this.userDataSubject.value;
    if (user) {
      if (user.type === 'guest') {
        delete user.couponsPurchased;
      }
      localStorage.setItem(this.localStorageKey, JSON.stringify(this.userDataSubject.value));
    }
  }

  private removeLocalUserData() {
    localStorage.removeItem(this.localStorageKey);
  }

  private handleError(error: HttpErrorResponse) {
    if (!error?.error || !error?.error?.error) {
      return throwError(() => new Error('Unknown error occurred'));
    }
    return throwError(() => new Error(error.error.error.message.replaceAll('_', ' ')));
  }

  private createUserData(params: { signup?: SignupData, response?: FirebaseResponseModel }): UserData {
    return {
      authData: params?.response,
      email: params?.signup?.email || null,
      name: params?.signup?.name || null,
      lastName: params?.signup?.lastName || null,
      type: params?.signup?.type || null,
      image: params?.signup?.image || null,
      couponsPurchased: [],
      couponsInWish: [],
      couponsInCart: [],
      preferredTheme: 'device'
    };

  }

  private guestUser(): Partial<UserData> {
    return {
      type: 'guest'
    }
  }

}
