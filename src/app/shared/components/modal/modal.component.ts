import {Component, ElementRef, HostBinding, HostListener, Input, OnChanges, OnInit, Self} from '@angular/core';
import {ModalService} from './modal.service';
import {IdGeneratorService} from '../../services/id-generator.service';
import {TranslateInOut} from '../../animations/translateInOut.animation';


@Component({
  selector: 'cs-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  animations: [TranslateInOut(300)]

})
export class ModalComponent implements OnInit, OnChanges {

  @Input() id: string;
  @Input() onOpenFn: (...params: any) => any;
  @Input() onCloseFn: (...params: any) => any;
  @Input() backdrop: boolean | 'static'         = true;
  @Input() size: 'sm' | 'default' | 'lg' | 'xl' = 'default';

  @HostBinding('id') protected selfId: string;
  @HostBinding('tabindex') protected tabIndex: string            = '-1';
  @HostBinding('style') protected style: string                  = 'height: fit-content;';
  @HostBinding('attr.aria-hidden') protected ariaHidden: boolean = true;
  @HostBinding('attr.aria-labelledby') protected labeledBy: string;
  @HostBinding('class') protected clazz: string;

  // @HostListener('show.bs.modal') protected _isShownListener = () => {
  //   this.isShown = true;
  //   if (this.onOpenFn) {
  //     this.onOpenFn();
  //   }
  // }
  //
  // @HostListener('hidden.bs.modal') protected _isHiddenListener = () => {
  //   this.isShown = false;
  //   if (this.onCloseFn) {
  //     this.onCloseFn();
  //   }
  // }

  protected isShown: boolean = false;

  open() {
    this.isShown    = true;
    this.ariaHidden = false;
    if (this.onOpenFn) {
      this.onOpenFn();
    }
  }

  close() {
    this.isShown    = false;
    this.ariaHidden = true;
    if (this.onCloseFn) {
      this.onCloseFn();
    }
  }

  constructor(private service: ModalService, private idGenerator: IdGeneratorService, @Self() public selfRef: ElementRef) {}

  ngOnInit(): void {
    this.id        = this.id == null ? 'cs_modal_' + this.idGenerator.generate() : this.id;
    this.selfId    = this.id;
    this.labeledBy = this.id + '-label';
    this.clazz     = 'modal' + (this.clazz ? ' ' + this.clazz : '');
    (this.service as any).registerModal(this);
  }

  ngOnChanges(): void {
    // this.dataBsBackdrop = this.backdrop;
  }

}
