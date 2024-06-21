import {Component, HostBinding, OnInit} from '@angular/core';


@Component({
  selector: 'cs-modal-header',
  templateUrl: './modal-header.component.html',
  styleUrls: ['./modal-header.component.scss']
})
export class ModalHeaderComponent implements OnInit {

  @HostBinding('class') clazz: string;

  ngOnInit(): void {
    this.clazz = 'modal-header';
  }
}
