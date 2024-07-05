import {Component, ElementRef, HostBinding, Input, OnInit, Self} from '@angular/core';
import {ModalService} from './modal.service';
import {IdGeneratorService} from '../../services/id-generator.service';
import {TranslateInOut} from '../../animations/translateInOut.animation';
import {Observable, Subject} from 'rxjs';
import {AnimationEvent} from '@angular/animations';


@Component({
  selector: 'cs-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  animations: [TranslateInOut(300)]

})
export class ModalComponent implements OnInit {

  private leaveTransitionEndedSubject = new Subject<void>();

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

  protected isShown: boolean = false;

  constructor(private service: ModalService, private idGenerator: IdGeneratorService, @Self() public selfRef: ElementRef) {}

  ngOnInit(): void {
    this.id        = this.id == null ? 'cs_modal_' + this.idGenerator.generate() : this.id;
    this.selfId    = this.id;
    this.labeledBy = this.id + '-label';
    this.clazz     = 'modal position-relative ms-auto me-auto ' + this.size + (this.clazz ? ' ' + this.clazz : '');
    (this.service as any).registerModal(this);
  }

  open() {
    this.service.open(this.id);
  }

  close() {
    this.service.close(this.id);
  }

  leaveTransitionEnded$(): Observable<void> {
    return this.leaveTransitionEndedSubject.asObservable();
  }

  protected onAnimationFinish(event: AnimationEvent): void {
    if (event.toState === 'void') {
      this.leaveTransitionEndedSubject.next();
    }
  }

  protected setOpen() {
    this.isShown    = true;
    this.ariaHidden = false;
    if (this.onOpenFn) {
      this.onOpenFn();
    }
  }

  protected setClose() {
    this.isShown    = false;
    this.ariaHidden = true;
    if (this.onCloseFn) {
      this.onCloseFn();
    }
  }

}
