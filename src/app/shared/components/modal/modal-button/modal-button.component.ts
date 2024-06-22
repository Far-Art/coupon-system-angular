import {
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Optional,
  Renderer2,
  Self
} from '@angular/core';
import {ModalComponent} from '../modal.component';
import * as bootstrap from 'bootstrap';
import {Modal} from 'bootstrap';


@Component({
  selector: 'cs-modal-button',
  templateUrl: './modal-button.component.html',
  styleUrls: ['./modal-button.component.scss']
})
export class ModalButtonComponent implements OnInit, OnChanges {

  @Input('modal-id') modalId: string | number;
  @Input('class') clazz: string;
  @Input('disabled') disabled: boolean = false;

  @HostBinding('id') protected id: string = '';
  @HostBinding('class') protected hostClazz: string;
  @HostBinding('role') protected role: string = 'button';

  @HostListener('click', ['$event']) clickEvent = () => {
    this.openModal();
  };

  private modal: Modal;

  constructor(
      @Optional() private hostModal: ModalComponent,
      @Self() private elRef: ElementRef,
      private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.modalId   = this.hostModal?.id || this.modalId;
    this.hostClazz = 'position-relative ' + (this.clazz ? this.clazz : 'btn btn-primary');
  }

  private openModal(): void {
    if (!this.disabled) {
      this.modal = bootstrap.Modal.getOrCreateInstance('cs-modal#' + this.modalId);
      this.modal.show();
    }
  }

  ngOnChanges(): void {
    if (this.disabled) {
      this.renderer.addClass(this.elRef.nativeElement, 'disabled');
      this.renderer.addClass(this.elRef.nativeElement, 'btn-outline-secondary');
      this.renderer.setStyle(this.elRef.nativeElement, 'pointer-events', 'auto');
      this.renderer.setStyle(this.elRef.nativeElement, 'cursor', 'not-allowed');
    } else {
      this.renderer.removeClass(this.elRef.nativeElement, 'disabled');
      this.renderer.removeClass(this.elRef.nativeElement, 'btn-outline-secondary');
      this.renderer.removeStyle(this.elRef.nativeElement, 'cursor');
    }
  }

}
