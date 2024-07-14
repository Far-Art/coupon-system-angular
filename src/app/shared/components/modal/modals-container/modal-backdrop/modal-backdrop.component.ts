import {Component, OnDestroy, OnInit} from '@angular/core';
import {ModalService} from '../../modal.service';
import {Subscription} from 'rxjs';


@Component({
  selector: 'cs-modal-backdrop',
  templateUrl: './modal-backdrop.component.html',
  styleUrls: ['./modal-backdrop.component.scss']
})
export class ModalBackdropComponent implements OnInit, OnDestroy {

  isShown: boolean;

  private subscription: Subscription;

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {
    this.subscription = this.modalService.backdropVisible$().subscribe(isShown => {
      this.isShown = isShown;
    });
  }

  onClick() {
    this.modalService['onBackdropClose']();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
