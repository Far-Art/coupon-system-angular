import {Component, ElementRef, HostBinding, Input, OnInit, Renderer2, Self} from '@angular/core';
import {ModalService} from './modal.service';
import {IdGeneratorService} from '../../services/id-generator.service';
import {translateInOutWithBlur} from '../../animations/translateInOut.animation';
import {Observable, Subject} from 'rxjs';
import {AnimationEvent} from '@angular/animations';
import {invalidClose} from './invalidClose.animation';


@Component({
  selector: 'cs-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  animations: [translateInOutWithBlur(280, {blur: 40}), invalidClose()]
})
export class ModalComponent implements OnInit {

  @Input() id: string;
  @Input() onOpenFn: (...params: any) => any;
  @Input() onCloseFn: (...params: any) => any;
  @Input() backdrop: boolean | 'static'         = true;
  @Input() size: 'sm' | 'default' | 'lg' | 'xl' = 'default';
  title: string;
  @HostBinding('id') protected selfId: string;
  @HostBinding('style') protected style: string;
  @HostBinding('class') protected clazz: string = 'modal position-relative ms-auto me-auto ';
  protected isShown: boolean                    = false;
  protected isInvalidClose: boolean             = false;
  private leaveTransitionEndedSubject           = new Subject<void>();

  constructor(
      private service: ModalService,
      private idGenerator: IdGeneratorService,
      private renderer: Renderer2,
      @Self() protected selfRef: ElementRef<HTMLElement>
  ) {}

  ngOnInit(): void {
    this.id     = this.id == null ? 'cs_modal_' + this.idGenerator.generate() : this.id;
    this.selfId = this.id;
    this.clazz += this.size + (this.clazz ? ' ' + this.clazz : '');
    this.service['registerModal'](this);
    setTimeout(() => {
      if (!this.title) {
        throw new Error('Modal header must be provided with title input, use cs-modal-header');
      }
    });
  }

  triggerInvalidCloseAnimation() {
    this.isInvalidClose = true;
    setTimeout(() => this.isInvalidClose = false,380);
  }

  open() {
    this.service.open(this.id);
  }

  close() {
    this.service.close();
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
    this.isShown = true;
    this.renderer.removeAttribute(this.selfRef.nativeElement, 'inert');
    if (this.onOpenFn) {
      this.onOpenFn();
    }
  }

  protected setClose() {
    this.isShown = false;
    this.renderer.setAttribute(this.selfRef.nativeElement, 'inert', '');

    if (this.onCloseFn) {
      this.onCloseFn();
    }
  }

}
