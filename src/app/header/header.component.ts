import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {AuthService} from '../auth/auth.service';
import {ActivatedRoute} from '@angular/router';
import {ScrollbarService} from '../shared/services/scrollbar.service';


@Component({
  selector: 'cs-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  constructor(
      private auth: AuthService,
      private route: ActivatedRoute,
      private scrollService: ScrollbarService
  ) {}

  userName: string;
  isShowHome = false;
  padding: string;

  private paddingNarrow = 'pt-1 pb-1';
  private paddingWide   = 'pt-4 pb-4';

  private authSub: Subscription;

  ngOnInit(): void {
    this.padding      = this.paddingWide;
    const url: string = this.route.snapshot['_routerState'].url;
    this.isShowHome   = url.length > 1;
    this.authSub      = this.auth.userName$.subscribe(name => this.userName = name);

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
