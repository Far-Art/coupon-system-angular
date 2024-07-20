import {Component, HostBinding, OnInit} from '@angular/core';


@Component({
  selector: 'cs-modal-footer',
  templateUrl: './modal-footer.component.html',
  styleUrls: ['./modal-footer.component.scss']
})
export class ModalFooterComponent implements OnInit {

  @HostBinding('class') clazz: string;

  constructor() {}

  ngOnInit(): void {
    this.clazz = 'modal-footer z-3';
  }

}
