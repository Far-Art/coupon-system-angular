import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {AuthService} from './auth/auth.service';
import {ModalService} from './shared/components/modal/modal.service';
import {ToastService} from './core/toasts/toast.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  static title = 'coupon system angular';
  @ViewChild('content', {static: true}) content: ElementRef<HTMLElement>

  constructor(private authService: AuthService, private modalService: ModalService, private renderer: Renderer2, public toastService: ToastService) {}

  ngOnInit(): void {
    this.authService.autoLogin();
    this.modalService.backdropVisible$().subscribe(isVisible => {
      if (isVisible) {
        this.renderer.setAttribute(this.content.nativeElement, 'inert', '');
      } else {
        this.renderer.removeAttribute(this.content.nativeElement, 'inert');
      }
    });
    this.click(); // TODO remove
  }

  // TODO remove
  click() {
    this.toastService.notify({
      message: 'created new toast',
      header: 'header',
      style: 'warning'
    });
  }
}
