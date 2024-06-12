import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {AuthService} from '../auth/auth.service';
import {ScrollbarService} from '../shared/services/scrollbar.service';
import {UserData} from '../shared/models/user-data.model';


@Component({
  selector: 'cs-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  constructor(
      private authService: AuthService,
      private scrollService: ScrollbarService
  ) {}

  userName: string;
  user: UserData;
  padding: string;

  private paddingNarrow = 'pt-1 pb-1';
  private paddingWide   = 'pt-4 pb-4';

  private authSub: Subscription;

  ngOnInit(): void {
    this.padding = this.paddingWide;

    this.authSub = this.authService.user$.subscribe(user => {
      this.user     = user;
      this.userName = this.userName = user != null && user.name != null ? user.name : 'Guest';
    });

    this.scrollService.scrollPosition$().subscribe(s => {
      if (s.y > 120 && s.scrollDirection === 'down') {
        this.padding = this.paddingNarrow;
      } else {
        this.padding = this.paddingWide;
      }
    });
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }

}
