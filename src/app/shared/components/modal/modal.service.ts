import {Injectable, Renderer2, RendererFactory2} from '@angular/core';
import {ModalComponent} from './modal.component';
import {ModalButtonComponent} from './modal-button/modal-button.component';
import {BehaviorSubject, Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalsMap: Map<string, ModalComponent>        = new Map();
  private buttonsMap: Map<string, ModalButtonComponent> = new Map();
  private showBackdrop                                  = new BehaviorSubject(false);
  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  backdropVisible$(): Observable<boolean> {
    return this.showBackdrop.asObservable();
  }

  close(modalId: string): void {
    // this.getButton(modalId).close();
    this.showBackdrop.next(false);
  }

  open(modalId: string): void {
    // this.getButton(modalId).open();
    this.showBackdrop.next(true);
    const modal = (this.modalsMap.values().next().value as ModalComponent).selfRef.nativeElement;
    this.renderer.addClass(modal, 'show');
    this.renderer.appendChild(document.body, (this.modalsMap.values().next().value as ModalComponent).selfRef.nativeElement);
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
