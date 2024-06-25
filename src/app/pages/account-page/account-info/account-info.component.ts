import {Component, OnDestroy, OnInit} from '@angular/core';
import {AccountService} from '../account.service';
import {Subscription} from 'rxjs';
import {UserData} from '../../../shared/models/user-data.model';


@Component({
  selector: 'sc-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss']
})
export class AccountInfoComponent implements OnInit, OnDestroy {

  user: UserData;

  private subscription: Subscription;

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.subscription = this.accountService.user$.subscribe((user: UserData) => this.user = user);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
