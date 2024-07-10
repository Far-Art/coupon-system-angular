import {AfterViewInit, Component, ElementRef, HostBinding, HostListener, Input, OnChanges, OnInit, Optional, Renderer2, Self} from '@angular/core';
import {ModalComponent} from '../modal.component';
import {ModalService} from '../modal.service';


@Component({
  selector: 'cs-modal-button',
  templateUrl: './modal-button.component.html',
  styleUrls: ['./modal-button.component.scss']
})
export class ModalButtonComponent implements OnInit, OnChanges, AfterViewInit {

  @Input('modal-id') modalId: string;
  @Input('class') clazz: string;
  @Input('disabled') disabled: boolean         = false;
  @Input() type: 'submit' | 'button' | 'reset' = 'button';
  @Input() action: 'close' | 'open' | 'go-back' | 'none';

  @HostBinding('id') protected id: string                            = '';
  @HostBinding('class') protected hostClazz: string;
  @HostBinding('role') protected role: string;
  @HostBinding('tabindex') protected tabIndex: string                = '0';
  @HostBinding('attr.aria-label') protected ariaLabel: string;
  @HostBinding('attr.aria-disabled') protected ariaDisabled: boolean = false;

  constructor(
      @Optional() private hostModal: ModalComponent,
      @Self() private selfRef: ElementRef<HTMLElement>,
      private renderer: Renderer2,
      private service: ModalService
  ) {}

  ngOnInit(): void {
    this.modalId   = this.modalId || this.hostModal?.id;
    this.hostClazz = 'position-relative ' + (this.clazz ? this.clazz : 'btn btn-primary');
    this.service['registerButton'](this.modalId, this);
  }

  ngOnChanges(): void {
    if (this.disabled) {
      this.renderer.addClass(this.selfRef.nativeElement, 'disabled');
      this.ariaDisabled = true;
    } else {
      this.renderer.removeClass(this.selfRef.nativeElement, 'disabled');
      this.ariaDisabled = false;
    }
  }

  close() {
    this.service.close();
  }

  open() {
    this.service.open(this.modalId);
  }

  ngAfterViewInit(): void {
    // ensure all fields was set
    setTimeout(() => {
      this.setType();
      this.setAction();
      this.setAriaLabel();
    })
  }

  @HostListener('keydown.enter')
  @HostListener('keydown.space')
  protected selfClick() {
    if (!this.disabled) {
      this.selfRef.nativeElement.click();
    }
  }

  @HostListener('click')
  protected onClick() {
    if (this.action === 'close') {
      this.close();
    } else if (this.action === 'open') {
      this.open();
    }
  }

  private setType() {
    if (this.type === 'submit') {
      this.role = 'submit';
    } else {
      this.role = 'button';
    }
  }

  private setAction() {
    if (!this.action) {
      if (!this.hostModal || this.hostModal.id !== this.modalId) {
        this.action = 'open';
      } else {
        this.action = 'none';
      }
    }
  }

  private setAriaLabel() {
    if (this.selfRef.nativeElement.ariaLabel) {
      this.ariaLabel = this.selfRef.nativeElement.ariaLabel;
      return;
    }

    const title = this.service.getModalTitle(this.modalId);
    if (this.action === 'close') {
      switch (this.type) {
        case 'submit':
          this.ariaLabel = 'Submit' + (title ? ' ' + title : '');
          break;
        case 'reset':
          this.ariaLabel = 'Reset' + (title ? ' ' + title : '');
          break;
        default:
          this.ariaLabel = 'Close' + (title ? ' ' + title : '');
      }
    } else if (this.action === 'open') {
      this.ariaLabel = 'Open ' + (title ? title + ' ' : '') + 'modal';
    }
  }

}
