import {Component, HostBinding, OnInit} from '@angular/core';


@Component({
  selector: 'cs-modal-body',
  templateUrl: './modal-body.component.html',
  styleUrls: ['./modal-body.component.scss']
})
export class ModalBodyComponent implements OnInit {

  @HostBinding('class') clazz: string;

  ngOnInit(): void {
    this.clazz = 'modal-body';
  }

}
