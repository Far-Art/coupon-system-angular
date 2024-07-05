import {Component, ElementRef, HostBinding, Input, OnChanges, OnInit, Self} from '@angular/core';
import {ModalComponent} from '../modal.component';


@Component({
  selector: 'cs-modal-header',
  templateUrl: './modal-header.component.html',
  styleUrls: ['./modal-header.component.scss']
})
export class ModalHeaderComponent implements OnInit, OnChanges {

  @HostBinding('class') clazz: string = 'modal-header justify-content-between';

  @Input() title: string;

  constructor(private modal: ModalComponent, @Self() private selfRef: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    if (!this.title) {
      throw new Error('Title must be provided');
    }
  }

  onClose() {
    this.modal.close();
  }

  ngOnChanges(): void {
    this.modal['title'] = this.title;
  }

}
