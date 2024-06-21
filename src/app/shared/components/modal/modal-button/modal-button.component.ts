import {Component, HostBinding, Input, OnInit, Optional} from '@angular/core';
import {ModalComponent} from '../modal.component';


@Component({
  selector: 'cs-modal-button',
  templateUrl: './modal-button.component.html',
  styleUrls: ['./modal-button.component.scss']
})
export class ModalButtonComponent implements OnInit {

  @Input('modal-id') modalId: string | number;
  @Input('class') clazz: string;
  @Input('disabled') disabled: boolean = false;

  @HostBinding('id') protected id: string;
  @HostBinding('class') protected hostClazz: string;
  @HostBinding('attr.data-bs-target') protected dataBsTarget: string;
  @HostBinding('attr.data-bs-toggle') protected dataBsToggle: string = 'modal';
  @HostBinding('attr.disabled') protected isHostDisabled: boolean    = false;
  @HostBinding('role') protected role: string;

  constructor(@Optional() private hostModal: ModalComponent) { }

  ngOnInit(): void {
    // TODO make disabled status
    this.modalId        = this.hostModal?.id || this.modalId;
    this.dataBsTarget   = '#' + this.modalId;
    this.role           = 'button';
    this.hostClazz      = 'position-relative ' + (this.clazz ? this.clazz : 'btn btn-primary');
    this.isHostDisabled = this.disabled;
  }

}
