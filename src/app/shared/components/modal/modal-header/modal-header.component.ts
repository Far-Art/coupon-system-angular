import {Component, HostBinding} from '@angular/core';
import {ModalComponent} from '../modal.component';


@Component({
  selector: 'cs-modal-header',
  templateUrl: './modal-header.component.html',
  styleUrls: ['./modal-header.component.scss']
})
export class ModalHeaderComponent {

  @HostBinding('class') clazz: string = 'modal-header justify-content-between';

  constructor(private modal: ModalComponent) {}

  onClose() {
    this.modal.close();
  }
}
