import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {UserData} from '../../shared/models/user-data.model';
import {Subscription} from 'rxjs';
import {AccountService} from './account.service';


@Component({
  selector: 'sc-account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss']
})
export class AccountPageComponent implements OnInit, OnDestroy {

  constructor(
      private authService: AuthService,
      private accountService: AccountService
  ) {}

  user: UserData;

  private subscription: Subscription;

  ngOnInit(): void {
    this.subscription = this.authService.user$.subscribe(user => {
      this.accountService.user   = user;
      this.accountService.userId = this.authService.authData.localId;
    });
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
