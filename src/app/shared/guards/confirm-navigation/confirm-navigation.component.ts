import {Component, OnInit} from '@angular/core';
import {ConfirmNavigationService} from './confirm-navigation.service';


@Component({
  selector: 'cs-confirm-navigation',
  templateUrl: './confirm-navigation.component.html',
  styleUrls: ['./confirm-navigation.component.scss']
})
export class ConfirmNavigationComponent implements OnInit {

  private defaultTitle   = 'Leaving the page';
  private defaultMessage = 'You are about to leave the page, all unsaved data will be lost, proceed?';

  params: {
    message?: string,
    title?: string,
  }

  constructor(private confirmService: ConfirmNavigationService) {}

  onConfirm() {
    this.confirmService.confirm();
  }

  onDecline() {
    this.confirmService.decline();
  }

  ngOnInit(): void {
    this.updateParams();
    const myModalEl = document.getElementById('navigationConfirmBackdrop')
    myModalEl.addEventListener('show.bs.modal', () => {
      this.updateParams();
    })
  }

  private updateParams() {
    this.params = {
      title: this.confirmService.params?.title || this.defaultTitle,
      message: this.confirmService.params?.message || this.defaultMessage
    }
  }

}
