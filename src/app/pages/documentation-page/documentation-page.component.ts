import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {Subscription} from 'rxjs';
import {AppComponent} from '../../app.component';


@Component({
  selector: 'cs-documentation-page',
  templateUrl: './documentation-page.component.html',
  styleUrls: ['./documentation-page.component.scss']
})
export class DocumentationPageComponent implements OnInit, OnDestroy {

  fullName: string;

  title = AppComponent.title;

  private subscription: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.subscription = this.authService.user$.subscribe(user => {
      this.fullName = user.name ? user.name + `${user.lastName ? ' ' + user.lastName : ''}` : null;
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
