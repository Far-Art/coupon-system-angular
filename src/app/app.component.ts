import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {AuthService} from './auth/auth.service';
import {BackdropService} from './core/services/backdrop/backdrop.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  static title = 'coupon system angular';
  @ViewChild('content', {static: true}) content: ElementRef<HTMLElement>

  constructor(private authService: AuthService, private backdropService: BackdropService, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.authService.autoLogin();
    this.backdropService.isVisible$().subscribe(isVisible => {
      if (isVisible) {
        this.renderer.setAttribute(this.content.nativeElement, 'inert', '');
      } else {
        this.renderer.removeAttribute(this.content.nativeElement, 'inert');
      }
    });
  }
}
