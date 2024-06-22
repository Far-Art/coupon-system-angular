import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../auth/auth.service';


@Component({
  selector: 'sc-account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss']
})
export class AccountPageComponent implements OnInit {

  constructor(private authService: AuthService) {}

  userName: string;

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.userName = user.name + (user.lastName ? ' ' + user.lastName : '');
      } else {
        this.userName = null;
      }
    })
  }

}
