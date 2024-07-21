import {ElementRef, Injectable, Renderer2, RendererFactory2} from '@angular/core';
import {ModalComponent} from './modal.component';
import {ModalButtonComponent} from './modal-button/modal-button.component';
import {Subject, take} from 'rxjs';
import {BackdropService} from '../../../core/services/backdrop/backdrop.service';


@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalsMap: Map<string, ModalComponent> = new Map();
  private buttonsMap: Map<string, ModalButtonComponent> = new Map();
  private okToOpen: Subject<void> = new Subject();
  private renderer: Renderer2;
  private containerElement: HTMLElement;
  private prevModal: ModalComponent;
  private currentModal: ModalComponent;
  private backdropConfig: boolean | 'static';

  constructor(rendererFactory: RendererFactory2, private backdropService: BackdropService) {
    this.renderer = rendererFactory.createRenderer(null, null);
    backdropService.onBackdropClick$().subscribe(() => this.onBackdropClose());
  }

  /**
   * close current open modal
   */
  close(closeBackdrop = true): void {
    if (this.currentModal) {
      this.currentModal.leaveTransitionEnded$().pipe(take(1))
          .subscribe(() => {
            if (closeBackdrop) {
              this.backdropService.hide();
            }
            this.renderer.removeChild(this.containerElement, this.currentModal['selfRef'].nativeElement);
            this.renderer.setStyle(this.containerElement, 'z-index', -10);
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
        this.close(false);
        this.okToOpen.pipe(take(1)).subscribe(() => {
          this.openModalFlow(modal);
        });
      } else {
        this.openModalFlow(modal);
      }
    }
  }

  goBack() {
    if (this.prevModal) {
      this.close(false);
      this.open(this.prevModal.id);
      this.prevModal = null;
    }
  }

  getModalTitle(modalId: string) {
    return this.modalsMap.get(modalId)?.title;
  }

  protected onBackdropClose() {
    if (this.backdropConfig === 'static' || this.backdropConfig === false) {
      this.currentModal.triggerInvalidCloseAnimation();
    } else {
      this.close();
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
    this.backdropService.show();
    this.backdropConfig = modal.backdrop;
    this.renderer.setStyle(this.containerElement, 'z-index', 1050);
    this.renderer.appendChild(this.containerElement, modal['selfRef'].nativeElement);
  }

}
