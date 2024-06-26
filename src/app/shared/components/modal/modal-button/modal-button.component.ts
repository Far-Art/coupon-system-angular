import {Component, ElementRef, HostBinding, Input, OnChanges, OnInit, Optional, Renderer2, Self} from '@angular/core';
import {ModalComponent} from '../modal.component';
import {ModalService} from '../modal.service';


@Component({
  selector: 'cs-modal-button',
  templateUrl: './modal-button.component.html',
  styleUrls: ['./modal-button.component.scss']
})
export class ModalButtonComponent implements OnInit, OnChanges {

  @Input('modal-id') modalId: string;
  @Input('class') clazz: string;
  @Input('disabled') disabled: boolean = false;

  @HostBinding('id') protected id: string                              = '';
  @HostBinding('class') protected hostClazz: string;
  @HostBinding('attr.data-bs-target') protected dataBsTarget: string;
  @HostBinding('attr.data-bs-toggle') protected dataBsToggle: string   = 'modal';
  @HostBinding('attr.data-bs-dismiss') protected dataBsDismiss: string = 'modal';
  @HostBinding('role') protected role: string                          = 'button';

  constructor(
      @Optional() private hostModal: ModalComponent,
      @Self() private selfRef: ElementRef,
      private renderer: Renderer2,
      private service: ModalService
  ) {}

  ngOnInit(): void {
    this.modalId      = this.modalId || this.hostModal?.id;
    this.dataBsTarget = '#' + this.modalId;
    this.hostClazz    = 'position-relative ' + (this.clazz ? this.clazz : 'btn btn-primary');
    (this.service as any).registerButton(this.modalId, this);
  }

  ngOnChanges(): void {
    if (this.disabled) {
      // ensure that service has registered the modal
      setTimeout(() => {
        // close the modal if its open
        this.close();
      });

      this.renderer.addClass(this.selfRef.nativeElement, 'disabled');
      this.renderer.addClass(this.selfRef.nativeElement, 'btn-outline-secondary');
    } else {
      this.renderer.removeClass(this.selfRef.nativeElement, 'disabled');
      this.renderer.removeClass(this.selfRef.nativeElement, 'btn-outline-secondary');
    }
  }

  close() {
    if ((this.service as any).getModal(this.modalId).isShown) {
      (this.selfRef.nativeElement as HTMLButtonElement).click();
    }
  }

  open() {
    if (!(this.service as any).getModal(this.modalId).isShown) {
      (this.selfRef.nativeElement as HTMLButtonElement).click();
    }
  }

}
