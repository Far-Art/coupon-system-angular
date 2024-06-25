import {Injectable} from '@angular/core';
import {ModalComponent} from './modal.component';
import {ModalButtonComponent} from './modal-button/modal-button.component';


@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalsMap: Map<string, ModalComponent>        = new Map();
  private buttonsMap: Map<string, ModalButtonComponent> = new Map();

  close(modalId: string): void {
    this.getButton(modalId).close();
  }

  open(modalId: string): void {
    this.getButton(modalId).open();
  }

  protected registerModal(modal: ModalComponent): void {
    this.modalsMap.set(modal.id, modal);
  }

  protected getModal(id: string): ModalComponent {
    return this.modalsMap.get(id);
  }

  protected registerButton(modalId: string, button: ModalButtonComponent): void {
    this.buttonsMap.set(modalId, button);
  }

  protected getButton(id: string): ModalButtonComponent {
    return this.buttonsMap.get(id);
  }
}
