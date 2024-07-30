import {Component, ElementRef, Input, Optional, Renderer2, Self} from '@angular/core';
import {ModalComponent} from '../modal.component';
import {ModalService} from '../modal.service';
import {ButtonComponent} from '../../basic/button/button.component';
import {FormGroupDirective} from '@angular/forms';


@Component({
  selector: 'cs-modal-button',
  templateUrl: '../../basic/button/button.component.html',
  styleUrls: ['./modal-button.component.scss']
})
export class ModalButtonComponent extends ButtonComponent {

  @Input('modal-id') modalId: string;
  @Input() action: 'close' | 'open' | 'go-back' | 'none';

  constructor(
      @Optional() private hostModal: ModalComponent,
      private service: ModalService,
      @Optional() formGroup: FormGroupDirective,
      @Self() selfRef: ElementRef<HTMLElement>,
      renderer: Renderer2
  ) {super(renderer, selfRef, formGroup);}

  override ngOnInit(): void {
    super.ngOnInit();
    this.modalId = this.modalId || this.hostModal?.id;
    this.service['registerButton'](this.modalId, this);
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    // ensure all fields was set
    setTimeout(() => {
      this.setAction();
      this.setAriaLabel();
    });
  }

  close() {
    this.service.close();
  }

  open() {
    this.service.open(this.modalId);
  }

  protected override onHostClick() {
    if (!this.disabled) {
      if (this.action === 'close') {
        this.close();
      } else if (this.action === 'open') {
        this.open();
      }
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

  override setAriaLabel() {
    if (this.selfRef.nativeElement.ariaLabel) {
      this.ariaLabel = this.selfRef.nativeElement.ariaLabel;
      return;
    }

    super.setAriaLabel();

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
      this.ariaLabel = 'Open ' + (title ? title + ' ' : '');
    }
  }
}
