import {Injectable} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
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

  private _loginForm: FormGroup;
  private _signupForm: FormGroup;

  set loginForm(form: FormGroup) {
    this._loginForm = form;
  }

  get loginForm() {
    return this._loginForm;
  }

  set signupForm(form: FormGroup) {
    this._signupForm = form;
  }

  get signupForm() {
    return this._signupForm;
  }

  login(data: LoginData) {
    this.loginForm = null;
  }

  signUp(data: SignupData) {
    this.signupForm = null;
  }
}
