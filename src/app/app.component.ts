import {Component, OnInit} from '@angular/core';
import {AuthService} from './auth/auth.service';
import {ModalService} from './shared/components/modal/modal.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  static title = 'coupon system angular';
  
  constructor(private authService: AuthService, private modalService: ModalService) {}

  ngOnInit(): void {
    this.authService.autoLogin();
  }

  onClick(){
    this.modalService.open(null);
  }
}
