import {AfterViewInit, Component, ElementRef, HostBinding, Input, OnInit, Self} from '@angular/core';
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
export class ModalComponent implements OnInit, AfterViewInit {

  @Input() id: string;
  @Input() onOpenFn: (...params: any) => any;
  @Input() onCloseFn: (...params: any) => any;
  @Input() backdrop: boolean | 'static'         = true;
  @Input() size: 'sm' | 'default' | 'lg' | 'xl' = 'default';

  @HostBinding('id') protected selfId: string;
  @HostBinding('style') protected style: string = 'height: fit-content;';
  @HostBinding('class') protected clazz: string;

  protected isShown: boolean          = false;
  protected title: string;
  private leaveTransitionEndedSubject = new Subject<void>();

  constructor(private service: ModalService, private idGenerator: IdGeneratorService, @Self() protected selfRef: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.id     = this.id == null ? 'cs_modal_' + this.idGenerator.generate() : this.id;
    this.selfId = this.id;
    this.clazz  = 'modal position-relative ms-auto me-auto ' + this.size + (this.clazz ? ' ' + this.clazz : '');
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
    if (!this.title) {
      throw new Error('Modal header must be provided with title input, use cs-modal-header');
    }

    if (event.toState === 'void') {
      this.leaveTransitionEndedSubject.next();
    }
  }

  protected setOpen() {
    this.isShown = true;

    if (this.onOpenFn) {
      this.onOpenFn();
    }
  }

  protected setClose() {
    this.isShown = false;
    if (this.onCloseFn) {
      this.onCloseFn();
    }
  }

  ngAfterViewInit(): void {
  }
}
