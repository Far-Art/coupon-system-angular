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

  @HostBinding('id') protected id: string = '';
  @HostBinding('class') protected hostClazz: string;
  @HostBinding('attr.data-bs-target') protected dataBsTarget: string;
  @HostBinding('attr.data-bs-toggle') protected dataBsToggle: string;
  @HostBinding('role') protected role: string;

  constructor(
      @Optional() private hostModal: ModalComponent,
      @Self() private selfRef: ElementRef,
      private renderer: Renderer2,
      private service: ModalService
  ) { }

  ngOnInit(): void {
    this.modalId      = this.hostModal?.id || this.modalId;
    this.dataBsTarget = '#' + this.modalId;
    this.role         = 'button';
    this.hostClazz    = 'position-relative ' + (this.clazz ? this.clazz : 'btn btn-primary');
  }

  ngOnChanges(): void {
    if (this.disabled) {
      // ensure that service has registered the modal
      setTimeout(() => {
        this.dataBsToggle = null;
        // close the modal if its open
        if (this.service.getModal(this.modalId).isShown) {
          this.selfRef.nativeElement.click();
        }
      });

      this.renderer.addClass(this.selfRef.nativeElement, 'disabled');
      this.renderer.addClass(this.selfRef.nativeElement, 'btn-outline-secondary');
    } else {
      this.dataBsToggle = 'modal';
      this.renderer.removeClass(this.selfRef.nativeElement, 'disabled');
      this.renderer.removeClass(this.selfRef.nativeElement, 'btn-outline-secondary');
    }
  }

}
