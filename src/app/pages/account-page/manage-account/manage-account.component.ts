import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService, UserType} from '../../../auth/auth.service';
import {map, Subscription} from 'rxjs';


@Component({
  selector: 'cs-manage-account',
  templateUrl: './manage-account.component.html',
  styleUrls: ['./manage-account.component.scss']
})
export class ManageAccountComponent implements OnInit, OnDestroy {

  isLoading: boolean = false;

  userType: UserType;

  private subscription: Subscription;

  constructor(private authService: AuthService) {}

  onLogout() {
    if (!this.isLoading) {
      this.isLoading = true;
      setTimeout(() => {
        this.authService.logout();
        this.isLoading = false
      }, 1100);
    }
  }

  ngOnInit(): void {
    this.subscription = this.authService.user$.pipe(map(user => user.type)).subscribe(type => this.userType = type);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
