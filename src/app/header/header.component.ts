import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {AuthService} from '../auth/auth.service';
import {ActivatedRoute} from '@angular/router';


@Component({
  selector: 'cs-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  constructor(private auth: AuthService, private route: ActivatedRoute) {}

  userName: string;
  isShowHome = false;

  private authSub: Subscription;

  ngOnInit(): void {
    const url: string = this.route.snapshot['_routerState'].url;
    this.isShowHome   = url.length > 1;
    this.authSub      = this.auth.userName$.subscribe(name => this.userName = name);
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }

}
