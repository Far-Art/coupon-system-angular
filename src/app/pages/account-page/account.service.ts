import {Injectable} from '@angular/core';
import {UserData} from '../../shared/models/user-data.model';


@Injectable()
export class AccountService {

  constructor() { }

  user: UserData | null
}
