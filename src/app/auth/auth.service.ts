import {Injectable} from '@angular/core';


@Injectable()
export class AuthService {

  readonly minLength = 6;

  readonly maxLength = 30;

  constructor() { }

  login(data: {
    email: string,
    password: string
  }) {

  }

  signUp(data: {
    name: string,
    lastName?: string
    email: string,
    password: string,
  }) {

  }
}
