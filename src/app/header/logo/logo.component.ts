import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {LogoService} from './logo.service';


@Component({
  selector: 'sc-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss']
})
export class LogoComponent implements OnInit, OnDestroy {

  isBlinked = false;

  private logoSub: Subscription;

  constructor(private logoService: LogoService) {}

  ngOnInit(): void {
    this.logoSub = this.logoService.blinked$.subscribe(() => this.logoBlink());
  }

  ngOnDestroy(): void {
    this.logoSub.unsubscribe();
  }

  private logoBlink() {
    this.isBlinked = true;
    setTimeout(() => this.isBlinked = false, 300);
  }

}
