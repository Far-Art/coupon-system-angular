import {Injectable} from '@angular/core';
import {ModalComponent} from './modal.component';


@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor() { }

  private map: Map<string, ModalComponent> = new Map();

  registerModal(modal: ModalComponent): void {
    this.map.set(modal.id, modal);
  }

  getModal(id: string): ModalComponent {
    return this.map.get(id);
  }
}
