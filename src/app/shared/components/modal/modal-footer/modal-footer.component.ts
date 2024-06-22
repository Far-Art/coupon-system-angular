import {Component, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {ModalComponent} from '../modal.component';


@Component({
  selector: 'cs-modal-footer',
  templateUrl: './modal-footer.component.html',
  styleUrls: ['./modal-footer.component.scss']
})
export class ModalFooterComponent implements OnInit , OnDestroy {

  @HostBinding('class') clazz: string;

  constructor(public host: ModalComponent) {}

  ngOnInit(): void {
    this.clazz = 'modal-footer';
  }

  ngOnDestroy(): void {
    console.log('footer destroyed')
  }

}
