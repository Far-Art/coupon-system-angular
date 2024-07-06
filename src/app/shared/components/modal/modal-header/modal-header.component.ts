import {Component, HostBinding, Input, OnChanges, OnInit} from '@angular/core';
import {ModalComponent} from '../modal.component';


@Component({
  selector: 'cs-modal-header',
  templateUrl: './modal-header.component.html',
  styleUrls: ['./modal-header.component.scss']
})
export class ModalHeaderComponent implements OnInit, OnChanges {

  @HostBinding('class') clazz: string = 'modal-header justify-content-between';

  @Input() title: string;

  constructor(private modal: ModalComponent) {}

  ngOnInit(): void {
    if (!this.title) {
      throw new Error('Title must be provided');
    }
    this.modal.title = this.title;
  }

  ngOnChanges(): void {
    this.modal.title = this.title;
  }

}
