import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../auth/auth.service';


@Component({
  selector: 'sc-account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss']
})
export class AccountPageComponent implements OnInit {

  constructor(private authService: AuthService) {}

  name: string;
  lastName: string;

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.name     = user?.name;
      this.lastName = user?.lastName;
    })
  }

}
