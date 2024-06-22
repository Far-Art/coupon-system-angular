import {Component, HostBinding, HostListener, Input, OnInit} from '@angular/core';
import {ModalService} from './modal.service';


@Component({
  selector: 'cs-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  @Input() id: string;
  @Input() onOpenFn: (...params: any) => any;
  @Input() onCloseFn: (...params: any) => any;

  @HostBinding('id') protected selfId: string;
  @HostBinding('tabindex') protected tabIndex: string      = '-1';
  @HostBinding('aria-hidden') protected ariaHidden: string = 'true';
  @HostBinding('attr.aria-labelledby') protected labeledBy: string;
  @HostBinding('class') protected clazz: string;
  @HostBinding('style.height') protected height: string    = '100svh';
  @HostBinding('style.width') protected width: string      = '100svw';

  @HostListener('show.bs.modal') protected _isShown = () => {
    this.isShown = true;
    if (this.onOpenFn) {
      this.onOpenFn();
    }
  }

  @HostListener('hide.bs.modal') protected _isHidden = () => {
    this.isShown = false;
    if (this.onCloseFn) {
      this.onCloseFn();
    }
  }

  isShown: boolean = false;

  constructor(private service: ModalService) {}

  private getRandomId() {
    return Math.random().toString(36).substring(0, 4);
  }

  ngOnInit(): void {
    this.id        = this.id == null ? 'cs_modal_' + this.getRandomId() : this.id;
    this.selfId    = this.id;
    this.labeledBy = this.id + '-label';
    this.clazz     = 'modal fade' + (this.clazz ? ' ' + this.clazz : '');
    this.service.registerModal(this);
  }

}
