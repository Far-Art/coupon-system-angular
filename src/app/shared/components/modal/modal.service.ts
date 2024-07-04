import {ElementRef, Injectable, Renderer2, RendererFactory2} from '@angular/core';
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
  private containerElement: HTMLElement;
  private currentOpenModal: ModalComponent;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  backdropVisible$(): Observable<boolean> {
    return this.showBackdrop.asObservable();
  }

  close(modalId?: string): void {
    this.showBackdrop.next(false);
    let modal: ModalComponent = this.currentOpenModal;

    if (!modal) {
      modal = this.modalsMap.get(modalId);
    }

    modal.close();
    const listener: () => void = this.renderer.listen(modal.selfRef.nativeElement, 'animationend', event => {
      this.renderer.removeChild(this.containerElement, modal.selfRef.nativeElement);
      listener();
    })

    // ensure that listener is called in case no animation end triggered
    setTimeout(() => {
      listener();
    }, 1000);
  }

  open(modalId: string): void {
    if (!this.containerElement) {
      throw new Error('No container provided, please use method registerContainer of modal.service');
    }
    this.showBackdrop.next(true);
    const modal = this.modalsMap.get(modalId);
    modal.open();
    this.currentOpenModal = modal;
    this.renderer.appendChild(this.containerElement, modal.selfRef.nativeElement);
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

  protected registerContainer(containerRef: ElementRef): void {
    this.containerElement = containerRef.nativeElement;
  }

  protected getButton(id: string): ModalButtonComponent {
    return this.buttonsMap.get(id);
  }
}
