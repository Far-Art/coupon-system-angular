import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {LogoService} from './logo.service';
import {WindowSizeService} from '../../shared/services/window-size.service';


@Component({
  selector: 'sc-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss']
})
export class LogoComponent implements OnInit, OnDestroy {

  isBlinked = false;

  @Input('showTitle') isOverrideShowTitle = false;

  isShowTitle: boolean;

  private logoSub: Subscription;
  private windowSizeSub: Subscription;

  constructor(private logoService: LogoService, private windowSizeService: WindowSizeService) {}

  ngOnInit(): void {
    this.logoSub = this.logoService.blinked$.subscribe(() => this.logoBlink());
    if (!this.isOverrideShowTitle) {
      this.windowSizeSub = this.windowSizeService.windowSize$.subscribe(size => {
        this.isShowTitle = size.width > 750;
      });
    } else {
      this.isShowTitle = true;
    }
  }

  private logoBlink() {
    this.isBlinked = true;
    setTimeout(() => this.isBlinked = false, 300);
  }

  ngOnDestroy(): void {
    this.logoSub.unsubscribe();
    if (this.windowSizeSub) this.windowSizeSub.unsubscribe();
  }

}
