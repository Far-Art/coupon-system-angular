import {Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {ModalService} from '../../modal.service';
import {Subscription} from 'rxjs';
import {FadeInOut} from '../../../../animations/fade-in-out.animation';


@Component({
  selector: 'cs-modal-backdrop',
  templateUrl: './modal-backdrop.component.html',
  styleUrls: ['./modal-backdrop.component.scss'],
  animations: [FadeInOut(150, 150, 0.5)]
})
export class ModalBackdropComponent implements OnInit, OnDestroy {

  isShown: boolean;

  private subscription: Subscription;

  constructor(private modalService: ModalService, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.subscription = this.modalService.backdropVisible$().subscribe(isShown => {
      this.isShown = isShown;
      if (isShown) {
        this.renderer.setStyle(document.body, 'overflow', 'hidden');
      } else {
        this.renderer.removeStyle(document.body, 'overflow');
      }
    });
  }

  onClick() {
    this.modalService.close(null);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
