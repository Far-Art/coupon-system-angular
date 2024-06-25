import {Injectable} from '@angular/core';
import {UserData} from '../../shared/models/user-data.model';
import {AuthService} from '../../auth/auth.service';
import {Observable} from 'rxjs';


@Injectable()
export class AccountService {

  constructor(private authService: AuthService) { }

  get user$(): Observable<Partial<UserData>> {
    return this.authService.user$;
  }

  updateUser(user: UserData) {
    this.authService.updateUser({user: user, immediate: true});
  }
}
