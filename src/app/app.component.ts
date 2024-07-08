import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {AuthService} from './auth/auth.service';
import {ModalService} from './shared/components/modal/modal.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('content', {static: true}) content: ElementRef<HTMLElement>

  static title = 'coupon system angular';

  constructor(private authService: AuthService, private modalService: ModalService, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.authService.autoLogin();
    this.modalService.backdropVisible$().subscribe(isVisible => {
      if (isVisible) {
        this.renderer.setAttribute(this.content.nativeElement, 'inert', '');
      } else {
        this.renderer.removeAttribute(this.content.nativeElement, 'inert');
      }
    });
  }
}
