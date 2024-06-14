import {Component, Input} from '@angular/core';


interface ModalParams {
  id?: string,
  hideButton?: boolean,
  buttonTitle?: string
}

interface CurrentModalParams extends ModalParams {
  headerTitle?: string,
}

@Component({
  selector: 'cs-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {

  @Input() current: CurrentModalParams = {id: this.getRandomId(), buttonTitle: 'open modal'};

  @Input() next: ModalParams;

  @Input() prev: ModalParams;

  private getRandomId() {
    return Math.random().toString(36).substring(0, 4);
  }

}
