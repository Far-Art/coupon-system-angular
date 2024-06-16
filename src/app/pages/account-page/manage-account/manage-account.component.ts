import {Component} from '@angular/core';
import {AuthService} from '../../../auth/auth.service';


@Component({
  selector: 'cs-manage-account',
  templateUrl: './manage-account.component.html',
  styleUrls: ['./manage-account.component.scss']
})
export class ManageAccountComponent {

  isLoading: boolean = false;

  constructor(public authService: AuthService) {}

  onLogout() {
    if (!this.isLoading) {
      this.isLoading = true;
      setTimeout(() => {
        this.authService.logout();
        this.isLoading = false
      }, 1100);
    }
  }

}
