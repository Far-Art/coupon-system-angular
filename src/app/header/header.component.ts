import {Component, OnDestroy, OnInit} from '@angular/core';
import {LogoService} from "./logo.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'cs-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private subscription!: Subscription;

  constructor(private logoService: LogoService) {}

  isBlinked = false;

  ngOnInit(): void {
    this.logoService.blinked$.subscribe(() => this.logoBlink());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private logoBlink() {
    this.isBlinked = true;
    setTimeout(() => this.isBlinked = false, 300);
  }

}
