import {ElementRef, Injectable, Renderer2, RendererFactory2} from '@angular/core';
import {ModalComponent} from './modal.component';
import {ModalButtonComponent} from './modal-button/modal-button.component';
import {BehaviorSubject, Observable, Subject, take} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalsMap: Map<string, ModalComponent>        = new Map();
  private buttonsMap: Map<string, ModalButtonComponent> = new Map();
  private showBackdrop                                  = new BehaviorSubject(false);
  private okToOpen: Subject<void>                       = new Subject();
  private renderer: Renderer2;
  private containerElement: HTMLElement;
  private prevModal: ModalComponent;
  private currentModal: ModalComponent;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  backdropVisible$(): Observable<boolean> {
    return this.showBackdrop.asObservable();
  }

  /**
   * close current open modal
   */
  close(): void {
    this.showBackdrop.next(false);
    if (this.currentModal) {
      this.currentModal.leaveTransitionEnded$().pipe(take(1))
          .subscribe(() => {
            this.renderer.removeChild(this.containerElement, this.currentModal['selfRef'].nativeElement);
            this.renderer.setStyle(this.containerElement, 'z-index', -1);
            this.renderer.removeStyle(document.body, 'overflow-y');
            this.currentModal = null;
            this.okToOpen.next();
          });
      this.currentModal['setClose']();
    }

  }

  open(modalId: string): void {
    if (!this.containerElement) {
      throw new Error('No container provided, please use method registerContainer of modal.service');
    }

    const modal = this.modalsMap.get(modalId);

    if (modal) {
      if (this.currentModal) {
        this.prevModal = this.currentModal;
        this.okToOpen.pipe(take(1)).subscribe(() => {
          this.openModalFlow(modal);
        });
        this.close();
      } else {
        this.openModalFlow(modal);
      }
    }
  }

  goBack() {
    if (this.prevModal) {
      this.close();
      this.open(this.prevModal.id);
      this.prevModal = null;
    }
  }

  getModalTitle(modalId: string) {
    return this.modalsMap.get(modalId)?.title;
  }

  protected registerModal(modal: ModalComponent): void {
    this.modalsMap.set(modal.id, modal);
  }

  protected registerButton(modalId: string, button: ModalButtonComponent): void {
    this.buttonsMap.set(modalId, button);
  }

  protected registerContainer(containerRef: ElementRef): void {
    this.containerElement = containerRef.nativeElement;
  }

  private openModalFlow(modal: ModalComponent) {
    this.currentModal = modal;
    modal['setOpen']();
    this.showBackdrop.next(true);
    this.renderer.setStyle(document.body, 'overflow-y', 'hidden');
    this.renderer.setStyle(this.containerElement, 'z-index', 9999);
    this.renderer.appendChild(this.containerElement, modal['selfRef'].nativeElement);
  }

}
