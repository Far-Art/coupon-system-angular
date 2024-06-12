import {Component, OnInit} from '@angular/core';
import {AccountService} from '../account.service';
import {UserType} from '../../../auth/auth.service';


@Component({
  selector: 'sc-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss']
})
export class AccountInfoComponent implements OnInit {

  type: UserType;

  constructor(public accountService: AccountService) {}

  ngOnInit(): void {
    this.type = this.accountService.user.type;
  }

}
