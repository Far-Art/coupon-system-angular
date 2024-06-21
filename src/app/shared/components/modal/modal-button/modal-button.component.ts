import {AfterViewInit, Component, ElementRef, Input, OnInit, Optional, Renderer2, Self} from '@angular/core';
import {ModalComponent} from '../modal.component';


@Component({
  selector: 'cs-modal-button',
  templateUrl: './modal-button.component.html',
  styleUrls: ['./modal-button.component.scss']
})
export class ModalButtonComponent implements OnInit, AfterViewInit {

  @Input() id: string | number;

  @Input('modal-id') modalId: string | number;

  @Input('class') clazz: string;

  @Input() disabled: boolean;

  constructor(
      @Optional() private hostModal: ModalComponent,
      @Self() private self: ElementRef,
      private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.modalId = this.hostModal?.id || this.modalId;
  }

  ngAfterViewInit(): void {
    if (this.clazz) {
      this.clazz.split(' ').forEach(clazz => {
        this.renderer.removeClass(this.self.nativeElement, clazz);
      })
    }
  }

}
