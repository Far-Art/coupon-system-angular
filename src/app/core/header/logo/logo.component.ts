import {Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {LogoService} from './logo.service';
import {WindowSizeService} from '../../../shared/services/window-size.service';
import {Router} from '@angular/router';


@Component({
  selector: 'sc-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss']
})
export class LogoComponent implements OnInit, OnChanges, OnDestroy {

  isBlinked = false;

  @Input('showTitle') isOverrideShowTitle = false;

  isShowTitle: boolean;

  private logoSub: Subscription;
  private windowSizeSub: Subscription;

  constructor(private logoService: LogoService, private windowSizeService: WindowSizeService, private router: Router) {}

  ngOnInit(): void {
    this.logoSub = this.logoService.blinked$.subscribe(() => this.logoBlink());
  }

  ngOnChanges(): void {
    if (!this.isOverrideShowTitle) {
      this.windowSizeSub = this.windowSizeService.windowSize$.subscribe(size => {
        this.isShowTitle = size.width > 750;
      });
    } else {
      this.isShowTitle = true;
    }
  }

  ngOnDestroy(): void {
    this.logoSub.unsubscribe();
    if (this.windowSizeSub) this.windowSizeSub.unsubscribe();
  }

  onLogoClick() {
    if (this.router.routerState.snapshot.url === '/home') {
      window.scrollTo(0, 0);
    } else {
      this.router.navigate(['/']);
    }
  }

  private logoBlink() {
    this.isBlinked = true;
    setTimeout(() => this.isBlinked = false, 300);
  }

}
