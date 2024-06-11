import {Injectable} from '@angular/core';
import {FormControl} from '@angular/forms';
import {BehaviorSubject, catchError, concatMap, Observable, take, tap, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {FirebaseResponseModel} from './models/firebase-response.model';
import {UserData} from '../shared/models/user-data.model';
import {DataManagerService} from '../shared/services/data-manager.service';


export type UserType = 'company' | 'customer' | 'admin';

export type LoginData = { email: string, password: string }

export type LoginForm = { email: FormControl<string>, password: FormControl<string> }

export type SignupData = {
  email: string,
  password: string,
  name: string,
  lastName: string | null,
  type: UserType
}

export type SignupForm = {
  email: FormControl<string>,
  password: FormControl<string>,
  name: FormControl<string>,
  lastName: FormControl<string | null>,
  type: FormControl<UserType>
}

@Injectable()
export class AuthService {

  private readonly FIREBASE_KEY = 'AIzaSyAS-z6cFLmZCdekAOJ2hTsFqcJD1D5WYV8';

  readonly passwordMinLength = 6;

  readonly passwordMaxLength = 30;

  private userDataSubject = new BehaviorSubject<UserData | null>(null);

  private authData: FirebaseResponseModel;

  private _loginFormData: LoginData;
  private _signupFormData: SignupData;

  constructor(private http: HttpClient, private dataManager: DataManagerService) { }

  get user$() {
    return this.userDataSubject.asObservable();
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

  login(login: LoginData): Observable<UserData> {
    return this.http.post<UserData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.FIREBASE_KEY}`,
        {
          email: login.email,
          password: login.password,
          returnSecureToken: true
        }).pipe(
        tap((res: FirebaseResponseModel) => this.authData = res),
        concatMap(res => this.dataManager.fetchUserData(res.localId)
            .pipe(take(1), tap((res: UserData) => this.userDataSubject.next(res)))),
        catchError(this.handleError));
  }

  signUp(signup: SignupData): Observable<FirebaseResponseModel> {
    return this.http.post<FirebaseResponseModel>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.FIREBASE_KEY}`,
        {
          email: signup.email,
          password: signup.password,
          returnSecureToken: true
        }).pipe(
        tap(res => this.authData = res),
        concatMap(res => this.dataManager.putUserData(res.localId, this.buildUserData(signup))
            .pipe(take(1), tap((res: UserData) => this.userDataSubject.next(res)))),
        catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (!error?.error || !error?.error?.error) {
      return throwError(() => new Error('Unknown error occurred'));
    }
    return throwError(() => new Error(error.error.error.message.replaceAll('_', ' ')));
  }

  private buildUserData(data: SignupData | UserData): UserData {
    return {
      email: data.email,
      name: data.name,
      lastName: data.lastName,
      type: data.type,
      couponsBought: data['couponsBought'] != null ? data['couponsBought'] : [],
      couponsInWish: data['couponsInWish'] != null ? data['couponsInWish'] : [],
      couponsInCart: data['couponsInCart'] != null ? data['couponsInCart'] : []
    } as UserData;
  }

}
