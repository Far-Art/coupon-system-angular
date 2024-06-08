import {Injectable} from '@angular/core';
import {FormControl} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';


export type UserType = 'company' | 'customer';

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

  readonly minLength = 6;

  readonly maxLength = 30;

  private userNameSubject = new BehaviorSubject<string>('Guest');

  get userName$() {
    return this.userNameSubject.asObservable();
  }

  constructor() { }

  private _loginFormData: LoginData;
  private _signupFormData: SignupData;

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

  login(data: LoginData) {
    this.loginFormData = null;
  }

  signUp(data: SignupData) {
    this.signupFormData = null;
  }
}
