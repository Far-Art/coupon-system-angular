import {Component, HostBinding, Input, OnInit} from '@angular/core';


@Component({
  selector: 'cs-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  @Input() id: string;

  @HostBinding('id') protected selfId: string;
  @HostBinding('tabindex') protected tabIndex: string      = '-1';
  @HostBinding('aria-hidden') protected ariaHidden: string = 'true';
  @HostBinding('attr.aria-labelledby') protected labeledBy: string;
  @HostBinding('class') protected clazz: string;
  @HostBinding('style.height') protected height: string    = '100svh';
  @HostBinding('style.width') protected width: string      = '100svw';

  constructor() {}

  private getRandomId() {
    return Math.random().toString(36).substring(0, 4);
  }

  ngOnInit(): void {
    this.id        = this.id == null ? 'cs_modal_' + this.getRandomId() : this.id;
    this.selfId    = this.id;
    this.labeledBy = this.id + '-label';
    this.clazz     = 'modal fade' + (this.clazz ? ' ' + this.clazz : '');
  }

}
