import {Injectable} from '@angular/core';
import {UserData} from '../../shared/models/user-data.model';
import {AuthService} from '../../auth/auth.service';
import {map, Observable} from 'rxjs';


@Injectable()
export class AccountService {

  constructor(private authService: AuthService) { }

  get user$(): Observable<UserData & { userId: string }> {
    return this.authService.user$.pipe(map(user => {
      return {...user, userId: this.authService.authData.localId};
    }));
  }

  updateUser(user: UserData) {
    this.authService.updateUser(user, true);
  }
}
