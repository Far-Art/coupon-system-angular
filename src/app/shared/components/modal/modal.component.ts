import {Component, HostBinding, HostListener, Input, OnChanges, OnInit} from '@angular/core';
import {ModalService} from './modal.service';
import {IdGeneratorService} from '../../services/id-generator.service';


@Component({
  selector: 'cs-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit, OnChanges {

  @Input() id: string;
  @Input() onOpenFn: (...params: any) => any;
  @Input() onCloseFn: (...params: any) => any;
  @Input() backdrop: boolean | 'static'         = true;
  @Input() size: 'sm' | 'default' | 'lg' | 'xl' = 'default';

  @HostBinding('id') protected selfId: string;
  @HostBinding('tabindex') protected tabIndex: string      = '-1';
  @HostBinding('aria-hidden') protected ariaHidden: string = 'true';
  @HostBinding('attr.aria-labelledby') protected labeledBy: string;
  @HostBinding('class') protected clazz: string;
  @HostBinding('style.height') protected height: string    = '100svh';
  @HostBinding('style.width') protected width: string      = '100svw';
  @HostBinding('attr.data-bs-backdrop') protected dataBsBackdrop: boolean | 'static';

  @HostListener('show.bs.modal') protected _isShownListener = () => {
    this.isShown = true;
    if (this.onOpenFn) {
      this.onOpenFn();
    }
  }

  @HostListener('hidden.bs.modal') protected _isHiddenListener = () => {
    this.isShown = false;
    if (this.onCloseFn) {
      this.onCloseFn();
    }
  }

  isShown: boolean = false;

  constructor(private service: ModalService, private idGenerator: IdGeneratorService) {}

  ngOnInit(): void {
    this.id        = this.id == null ? 'cs_modal_' + this.idGenerator.generate() : this.id;
    this.selfId    = this.id;
    this.labeledBy = this.id + '-label';
    this.clazz     = 'modal fade' + (this.clazz ? ' ' + this.clazz : '');
    (this.service as any).registerModal(this);
  }

  ngOnChanges(): void {
    this.dataBsBackdrop = this.backdrop;
  }

}
