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

  close(modalId?: string): void {
    let modal: ModalComponent = this.currentModal;
    if (!modal || modalId != null) {
      modal = this.modalsMap.get(modalId);
    }

    modal['setClose']();

    // TODO fix the inert not being removed, seems like prev modal still exist
    if (!this.prevModal) {
      this.showBackdrop.next(false);
    }

    modal.leaveTransitionEnded$().pipe(take(1))
         .subscribe(() => {
           this.renderer.removeChild(this.containerElement, modal['selfRef'].nativeElement);
           this.renderer.setStyle(this.containerElement, 'z-index', -1);
           this.renderer.removeStyle(document.body, 'overflow-y');
           this.currentModal = null;
           this.okToOpen.next();
         });

  }

  open(modalId: string): void {
    if (!this.containerElement) {
      throw new Error('No container provided, please use method registerContainer of modal.service');
    }

    const modal = this.modalsMap.get(modalId);

    if (modal) {
      if (this.prevModal) {
        this.okToOpen.pipe(take(1)).subscribe(() => {
          this.openModalFlow(modal);
        });
        this.close(this.prevModal.id);
        this.prevModal = null;
      } else {
        this.prevModal = modal;
        this.openModalFlow(modal);
      }
    }

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
